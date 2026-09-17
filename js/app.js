import Vue from '../assets/vue-2.6.10.esm.browser.min.js';
import { Pingo } from './pingo.js';
import { repository } from './repository.js';

const DEFAULT_MAX_NUMBER = 75;
const MIN_MAX_NUMBER = 1;
const MAX_MAX_NUMBER = 999;

export function parseParams() {
  const params = new URLSearchParams(window.location.search);
  const rawMax = parseInt(params.get('max'), 10);
  const maxNumber =
    Number.isInteger(rawMax) && rawMax >= MIN_MAX_NUMBER && rawMax <= MAX_MAX_NUMBER
      ? rawMax
      : DEFAULT_MAX_NUMBER;

  return { maxNumber };
}

export class App {
  constructor({ maxNumber } = {}) {
    console.log('config', {
      maxNumber,
    });

    let { numbers, selectedCount: initialSelectedCount } =
      repository.load() || {};
    if (
      !Array.isArray(numbers) ||
      numbers.length !== maxNumber ||
      typeof initialSelectedCount !== 'number'
    ) {
      numbers = _.shuffle(_.range(1, maxNumber + 1));
      initialSelectedCount = 0;
    }

    const vm = new Vue({
      el: '#app',
      data: {
        numbers,
        initialSelectedCount,
      },
      components: {
        Pingo,
      },
      template: `
        <pingo
          ref="pingo"
          :numbers="numbers"
          :initialSelectedCount="initialSelectedCount"
        />
      `,
    });
    const { pingo } = vm.$refs;

    window.addEventListener('keydown', e => {
      if (pingo.confirmingReset) {
        if (e.code === 'Escape') {
          pingo.cancelReset();
        } else if (e.code === 'Enter' || e.code === 'NumpadEnter') {
          pingo.confirmReset();
        }
        return;
      }

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        pingo.toggle();
      }
    });
  }
}
