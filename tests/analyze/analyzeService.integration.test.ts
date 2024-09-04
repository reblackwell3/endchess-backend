import request from 'supertest';
import { connectDB, closeDB } from '../../src/config/db';

import express from 'express';

import analyzeRoutes from '../../src/features/analyze/analyzeRoutes';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

app.use('/analyze', analyzeRoutes);

connectDB();

describe('Analyze Service Integration Test', () => {
  it('should analyze pgn', async () => {
    const pgn =
      '[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "2024.04.24"]\n[Round "-"]\n[White "blackfromchina"]\n[Black "Rulek"]\n[Result "0-1"]\n[CurrentPosition "1k6/1q3p1p/1n1p4/5p2/QpK2P1P/5P2/1PP3r1/4R3 w - -"]\n[Timezone "UTC"]\n[ECO "B07"]\n[ECOUrl "https://www.chess.com/openings/Pirc-Defense-Czech-Defense-4.f4-Qa5"]\n[UTCDate "2024.04.24"]\n[UTCTime "09:35:47"]\n[WhiteElo "1481"]\n[BlackElo "1527"]\n[TimeControl "180+2"]\n[Termination "Rulek won by resignation"]\n[StartTime "09:35:47"]\n[EndDate "2024.04.24"]\n[EndTime "09:41:14"]\n[Link "https://www.chess.com/game/live/107690516609"]\n\n1. e4 {[%clk 0:03:01.1]} 1... d6 {[%clk 0:03:01.1]} 2. d4 {[%clk 0:03:01.2]} 2... Nf6 {[%clk 0:03:02.6]} 3. Nc3 {[%clk 0:03:00.6]} 3... c6 {[%clk 0:03:02.8]} 4. f4 {[%clk 0:02:57.4]} 4... Qa5 {[%clk 0:03:03.9]} 5. Nf3 {[%clk 0:02:57.3]} 5... Nxe4 {[%clk 0:03:04.2]} 6. Bd2 {[%clk 0:02:52.9]} 6... Nxd2 {[%clk 0:03:03.2]} 7. Qxd2 {[%clk 0:02:53]} 7... Bg4 {[%clk 0:03:02.6]} 8. Bc4 {[%clk 0:02:50.7]} 8... Bxf3 {[%clk 0:03:02.7]} 9. gxf3 {[%clk 0:02:51.8]} 9... b5 {[%clk 0:03:03.1]} 10. Bb3 {[%clk 0:02:44.5]} 10... e6 {[%clk 0:03:03.8]} 11. O-O-O {[%clk 0:02:44.6]} 11... Be7 {[%clk 0:03:03.5]} 12. Rhg1 {[%clk 0:02:39.6]} 12... Bf6 {[%clk 0:03:04.2]} 13. Rg2 {[%clk 0:02:14]} 13... Qc7 {[%clk 0:03:03]} 14. Ne4 {[%clk 0:02:12.8]} 14... Nd7 {[%clk 0:02:50.8]} 15. Nxf6+ {[%clk 0:02:06.6]} 15... gxf6 {[%clk 0:02:50.9]} 16. Rdg1 {[%clk 0:01:50.8]} 16... O-O-O {[%clk 0:02:51.4]} 17. Rg7 {[%clk 0:01:42]} 17... Rdf8 {[%clk 0:02:50.3]} 18. Qd3 {[%clk 0:01:41]} 18... f5 {[%clk 0:02:44.6]} 19. h4 {[%clk 0:01:26.8]} 19... a5 {[%clk 0:02:45.4]} 20. a3 {[%clk 0:01:26]} 20... b4 {[%clk 0:02:39.2]} 21. axb4 {[%clk 0:01:24.9]} 21... axb4 {[%clk 0:02:41.1]} 22. Kd2 {[%clk 0:01:26.1]} 22... c5 {[%clk 0:02:42.2]} 23. Ra1 {[%clk 0:01:26.1]} 23... Kb8 {[%clk 0:02:41.2]} 24. Qb5+ {[%clk 0:01:17.9]} 24... Qb7 {[%clk 0:02:38.7]} 25. Qa4 {[%clk 0:00:59.9]} 25... Rhg8 {[%clk 0:02:36.8]} 26. Rxg8 {[%clk 0:00:52.6]} 26... Rxg8 {[%clk 0:02:37.7]} 27. d5 {[%clk 0:00:51.2]} 27... Rg2+ {[%clk 0:02:38]} 28. Kd3 {[%clk 0:00:44.1]} 28... exd5 {[%clk 0:02:30.2]} 29. Re1 {[%clk 0:00:35.2]} 29... c4+ {[%clk 0:02:31.4]} 30. Bxc4 {[%clk 0:00:27]} 30... dxc4+ {[%clk 0:02:32.4]} 31. Kxc4 {[%clk 0:00:25.3]} 31... Nb6+ {[%clk 0:02:32.2]} 0-1\n';

    const response = await request(app).post('/analyze/pgn').send({ pgn });

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('analysis');
    expect(response.body.analysis).toBeDefined();
  }, 200000);
});
