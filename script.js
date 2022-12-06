//Import dos valores

const lSub = document.querySelector('.Lsub');
const l1 = document.querySelector('.L1');
const l2 = document.querySelector('.L2');
const l3 = document.querySelector('.L3');
const l5 = document.querySelector('.L5');
const t = document.querySelector('.T');
const button = document.querySelector('button');
const l4 = document.getElementById('L4');
const q = document.getElementById('Q');
const dComercial = [
  13, 19, 25, 32, 38, 50, 63, 75, 100, 125, 150, 200, 250, 300, 350,
];

l4.addEventListener('change', getValue);
q.addEventListener('change', getValue);

function getValue() {
  const comp4 = l4.value;
  const vazao = q.value / 1000;
  const tempo = +t.innerText;
  const dRec = calcTubulacao(vazao, t.innerText) * 1000;
  console.log(dRec);
}

function calcTubulacao(vazao, tempo) {
  const dRec = 1.3 * Math.sqrt(vazao) * Math.pow(tempo / 24, 0.25);
  return dRec;
}

function calcVelocidade(vazao, diametroRec, diametroSuc) {
  const vRec = vazao / (0.7854 * Math.pow(diametroRec, 2));
  const vSuc = vazao / (0.7854 * Math.pow(diametroSuc, 2));
}

function calcRe(velocidade, diametroSuc, viscosidade) {}
