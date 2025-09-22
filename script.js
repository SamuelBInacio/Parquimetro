class Parquimetro {
  constructor(tabelaPrecos) {
    this.tabelaPrecos = tabelaPrecos;
  }

  calcularTempo(valorPago) {
    let tempoTotalMinutos = 0;
    let valorRestante = valorPago;

    for (const [valor, minutos] of Object.entries(this.tabelaPrecos).sort((a, b) => b[0] - a[0])) {
      while (valorRestante >= valor) {
        tempoTotalMinutos += minutos;
        valorRestante -= valor;
      }
    }
    return tempoTotalMinutos;
  }

  processarPagamento(valorPago) {
    const valorMinimo = Object.keys(this.tabelaPrecos).sort((a, b) => a - b)[0];
    const tempoEmMinutos = this.calcularTempo(valorPago);

    if (valorPago < valorMinimo) {
      return {
        mensagem: `Valor insuficiente. O valor mínimo é R$ ${valorMinimo.toFixed(2)}.`,
        tempo: 0,
        troco: valorPago
      };
    }

    const valorDevido = valorPago - (valorPago % valorMinimo);
    const troco = valorPago - valorDevido;

    return {
      mensagem: 'Pagamento processado com sucesso!',
      tempo: tempoEmMinutos,
      troco: troco
    };
  }
}

const tabelaPrecos = {
  '1.00': 30,
  '1.75': 60,
  '3.00': 120,
};

const meuParquimetro = new Parquimetro(tabelaPrecos);

document.addEventListener('DOMContentLoaded', () => {
  const valorInput = document.getElementById('valorPago');
  const calcularBtn = document.getElementById('calcularBtn');
  const resultadoDiv = document.getElementById('resultado');

  calcularBtn.addEventListener('click', () => {
    const valorPago = parseFloat(valorInput.value);

    if (isNaN(valorPago) || valorPago < 0) {
      resultadoDiv.innerHTML = '<p style="color: red;">Por favor, insira um valor válido.</p>';
      return;
    }

    const resultado = meuParquimetro.processarPagamento(valorPago);
    exibirResultado(resultado);
  });

  function exibirResultado(resultado) {
    const { mensagem, tempo, troco } = resultado;
    const trocoFormatado = troco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    let tempoFormatado = '';
    if (tempo > 0) {
      const horas = Math.floor(tempo / 60);
      const minutos = tempo % 60;
      tempoFormatado = `Você tem direito a ${horas} hora(s) e ${minutos} minuto(s) de estacionamento.`;
    }

    resultadoDiv.innerHTML = `
            <p><strong>Status:</strong> ${mensagem}</p>
            ${tempoFormatado ? `<p><strong>Tempo de Permanência:</strong> ${tempoFormatado}</p>` : ''}
            <p><strong>Troco:</strong> ${trocoFormatado}</p>
        `;
  }
});
