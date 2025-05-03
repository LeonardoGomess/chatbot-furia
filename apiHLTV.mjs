import { HLTV } from 'hltv';
import { promises as fs } from 'fs';

async function saveJson(filename, data) {
    try {
        await fs.writeFile(`./${filename}.json`, JSON.stringify(data, null, 2));
        console.log(`✅ Arquivo ${filename}.json salvo com sucesso!\n`);
    } catch (error) {
        console.error(`❌ Erro ao salvar ${filename}.json:`, error.message);
    }
}

// Funções

async function getTeamInfo() {
    try {
        const furia = await HLTV.getTeam({ id: 8297 });
        if (!furia) {
            console.log("Nenhum dado encontrado para a FURIA.");
            return;
        }

        console.log("\n=== 🏆 Informações da FURIA ===");
        console.log(`Nome do time: ${furia.name}`);
        console.log("Jogadores:");
        furia.players.forEach(player => {
            console.log(` - ${player.name} (nickname: ${player.name})`);
        });

        await saveJson('teamInfo', furia);
    } catch (error) {
        console.error("❌ Erro ao obter informações do time:", error.message);
    }
}

async function getTeamStats() {
    try {
        const teamStats = await HLTV.getTeamStats({ id: 8297 });
        console.log("\n=== 📊 Estatísticas Gerais da FURIA ===");
        console.log(teamStats);

        await saveJson('teamStats', teamStats);
    } catch (error) {
        console.error("❌ Erro ao obter estatísticas do time:", error.message);
    }
}
async function getMatches() {
    try {
        const delayTime = 1000; // Delay de 1 segundo entre requisições

        // Obtendo a lista de todas as partidas
        const allMatches = await HLTV.getMatches();

        // Filtrando partidas da FURIA (id 8297)
        const furiaMatches = allMatches.filter(match => match.team1?.id === 8297 || match.team2?.id === 8297);

        console.log("\n=== 🎯 Próximas Partidas da FURIA ===");
        furiaMatches.forEach(match => {
            console.log(` - ${match.team1?.name} vs ${match.team2?.name} em ${match.event?.name}`);
        });

        // Salvando as partidas da FURIA em um arquivo JSON
        await saveJson('furia_matches', furiaMatches);

      
    } catch (error) {
        console.error("❌ Erro ao obter partidas:", error.message);
    }
}



async function getEvents() {
    try {
        const events = await HLTV.getEvents({ attendingTeamIds: [8297] });
        console.log("\n=== 📅 Próximos Eventos da FURIA ===");
        events.forEach(event => {
            console.log(`🏆 ${event.name} em ${new Date(event.dateStart).toLocaleDateString('pt-BR')} (${event.location?.code || 'desconhecido'})`);
        });

        await saveJson('events', events);
    } catch (error) {
        console.error("❌ Erro ao obter eventos:", error.message);
    }
}

async function getPastEvents() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const pastEvents = await HLTV.getPastEvents({
            attendingTeamIds: [8297],
            startDate: '2024-01-01',
            endDate: today
        });

        console.log("\n=== 🏅 Eventos Passados da FURIA ===");
        pastEvents.forEach(event => {
            console.log(`🏆 ${event.name} em ${new Date(event.dateStart).toLocaleDateString('pt-BR')} (${event.location?.code || 'desconhecido'})`);
        });

        await saveJson('pastEvents', pastEvents);
    } catch (error) {
        console.error("❌ Erro ao obter eventos passados:", error.message);
    }
}

async function getTeamRanking() {
    try {
        // Obtém o ranking global mais recente
        const rankings = await HLTV.getTeamRanking();
        const furiaRanking = rankings.find(team => team.id === 8297);

        console.log("\n=== 🏆 Ranking Global da FURIA ===");
        if (furiaRanking) {
            console.log(`FURIA está em #${furiaRanking.rank} no ranking global.`);
        } else {
            console.log("FURIA não encontrada no ranking global.");
        }

        // Salva o ranking completo em um arquivo JSON
        await saveJson('teamRanking', rankings);
        console.log("✅ Ranking global salvo com sucesso.");
    } catch (error) {
        console.error("❌ Erro ao obter ranking global:", error.message);
    }
}

async function playersList() {
    try {
        const team = await HLTV.getTeam({ id: 8297 });
        const players = team.players.map(player => ({
            name: player.name,
            nick: player.name,
            id: player.id
        }));

        console.log("\n=== 👥 Lista de Jogadores da FURIA ===");
        players.forEach(player => {
            console.log(` - ${player.name} (Nick: ${player.name})`);
        });

        await saveJson('playersList', players);

        // Retorna a lista de jogadores
        return players;
    } catch (error) {
        console.error("❌ Erro ao obter jogadores:", error.message);
        return []; // Retorna uma lista vazia em caso de erro
    }
}

async function getPlayerStats() {
    try {
        const players = await playersList();
        const playerStats = [];

        for (const player of players) {
            try {
                const stats = await HLTV.getPlayerStats({ id: player.id });

                console.log(`\n=== 📈 Estatísticas do Jogador: ${player.name} ===`);
                console.log(`- K/D: ${stats.overviewStatistics.kdRatio}`);
                console.log(`- Kills: ${stats.overviewStatistics.kills}`);
                console.log(`- Headshots: ${stats.overviewStatistics.headshots}`);
                console.log(`- Rating 1: ${stats.overviewStatistics.rating1}`);
                console.log(`- Rating 2: ${stats.overviewStatistics.rating2}`);

                playerStats.push({
                    name: player.name,
                    nick: player.nick,
                    stats: stats.overviewStatistics
                });
            } catch (error) {
                console.error(`❌ Erro ao obter estatísticas do jogador ${player.name}:`, error.message);
                // Mesmo com erro, adiciona o jogador com estatísticas vazias
                playerStats.push({
                    name: player.name,
                    nick: player.nick,
                    stats: null // Estatísticas não disponíveis
                });
            }
        }

        await saveJson('playerStats', playerStats);
        console.log("✅ Estatísticas dos jogadores salvas com sucesso.");
    } catch (error) {
        console.error("❌ Erro ao processar estatísticas dos jogadores:", error.message);
    }
}


// Execução principal
async function run() {
    try {
        console.log("Iniciando coleta de dados...");

       // await getTeamInfo();
       // console.log("✅ Dados do time coletados.");

        // await delay(5000);
        // await getTeamStats();
        // console.log("✅ Estatísticas do time coletadas.");

        // await delay(5000);
        // await playersList();
        // console.log("✅ Lista de jogadores coletada.");

        // await delay(5000);
        // await getMatches();
        // console.log("✅ Próximas partidas coletadas.");

        // await delay(5000);
        // await getEvents();
        // console.log("✅ Próximos eventos coletados.");

        // await delay(5000);
        // await getPlayerStats();
        // console.log("✅ Estatísticas dos jogadores coletadas.");

        // await delay(5000);
        // await getPastEvents();
        // console.log("✅ Eventos passados coletados.");

        // await delay(5000);
        // await getTeamRanking();
        // console.log("✅ Ranking do time coletado.");


        console.log("Coleta de dados concluída.");
    } catch (error) {
        console.error("❌ Erro durante a execução:", error.message);
    }
}

// Função auxiliar para adicionar um atraso
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Inicia tudo
run();
