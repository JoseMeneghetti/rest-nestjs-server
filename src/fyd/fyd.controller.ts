import { Controller, Get } from '@nestjs/common';
import { ScrapingService } from './scraping/scraping.service';

@Controller('fyd')
export class AppController {
  constructor(private readonly scraping: ScrapingService) {}

  @Get('compare/nike/dunk')
  async getNikeDunk() {
    const url =
      'https://apigateway.nike.com.br/nike-bff/search?term=dunk&sorting=relevance&resultsPerPage=999&scoringProfile=scoreByRanking&multiFilters=false';

    const dunk_id = 'cld103bwq0000u8afhw7cmhrr';

    return this.scraping.nike(url, dunk_id);
  }

  @Get('compare/nike/aj1')
  async getNikeAj1() {
    const url =
      'https://apigateway.nike.com.br/nike-bff/search?term=air+jordan+1&sorting=relevance&resultsPerPage=999&scoringProfile=scoreByRanking&multiFilters=false';

    const aj1_id = 'cld104bns0002u8af3qncqae7';

    return this.scraping.nike(url, aj1_id);
  }

  @Get('compare/nike/snkrs')
  async getNikeSnkrs() {
    const url =
      'https://apigateway.nike.com.br/nike-bff/search/snkrs/stock?page=1&resultsPerPage=999&sorting=relevance&scoringProfile=scoreByRelevance';

    const snkrs_id = 'cld0uuuoh0000u8t1edk854dj';

    return this.scraping.nike(url, snkrs_id);
  }

  @Get('compare/artwalk/dunk')
  async getArtwalkDunk() {
    const url =
      'https://www.artwalk.com.br/buscapagina?ft=T%C3%AAnis+Dunk&O=OrderByReleaseDateDESC&PS=24&sl=92fcab2c-fa76-499b-8403-cbf63f6189bc&cc=1&sm=0&PageNumber=';

    const artwalk_dunk_id = 'clfly46450000u8hm8zqbbq8k';

    return this.scraping.artWalk(url, artwalk_dunk_id);
  }

  @Get('compare/artwalk/aj1')
  async geArtwalkAj1() {
    const url =
      'https://www.artwalk.com.br/buscapagina?fq=specificationFilter_16%3aT%C3%AAnis&fq=specificationFilter_15%3aJordan&O=OrderByReleaseDateDESC&PS=24&sl=92fcab2c-fa76-499b-8403-cbf63f6189bc&cc=1&sm=0&PageNumber=';

    const artwalk_aj1_id = 'clflnhqio0000u860mnor5vtt';

    return this.scraping.artWalk(url, artwalk_aj1_id);
  }
}
