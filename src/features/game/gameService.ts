import repo from './gameRepo';
import { GamesSettings, GamesSettingsDto } from 'endchess-api-settings';

class GameService {
  async findGame(settings: GamesSettingsDto) {
    const [category] = settings.ratingCategories || [];
    switch (category) {
      case GamesSettings.RatingCategory.MASTER:
        return await repo.findRandomGameRatedGreaterThan(2400);
        break;
      case GamesSettings.RatingCategory.NEAR_RATING:
        throw new Error('Not implemented');
        break;
      default:
        return await repo.findRandomGame();
    }
  }
}

export default new GameService();
