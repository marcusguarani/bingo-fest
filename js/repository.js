const key = 'bingofest';

class Repository {
  save(data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.warn('Não foi possível salvar o progresso do bingo:', err);
    }
  }

  load() {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (err) {
      console.warn('Não foi possível carregar o progresso do bingo:', err);
      return null;
    }
  }
}

export const repository = new Repository();
