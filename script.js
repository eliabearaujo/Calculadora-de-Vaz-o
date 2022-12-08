//Import dos valores

const lSub = document.querySelector('.Lsub');
const l1 = document.querySelector('.L1');
const l2 = document.querySelector('.L2');
const l3 = document.querySelector('.L3');
const l5 = document.querySelector('.L5');
const t = document.querySelector('.T');
const button = document.querySelector('.calcular');
const l4 = document.getElementById('L4');
const q = document.getElementById('Q');
const Lsuc = document.getElementById('Lsuc');
const Ksuc = document.getElementById('Ksuc');
const Lrec = document.getElementById('Lrec');
const Krec = document.getElementById('Krec');
const dComercial = [
  13, 19, 25, 32, 38, 50, 63, 75, 100, 125, 150, 200, 250, 300, 350,
];
const viscosidade = 0.000001;
const rugosidade = 0.0015;
const gravidade = 9.8;
const altura = document.getElementById('altura');
const Watt = document.getElementById('Watt');
const result = document.querySelector('.result');

l4.addEventListener('change', getValue);
q.addEventListener('change', getValue);
Lsuc.addEventListener('change', getValue);
Ksuc.addEventListener('change', getValue);
Lrec.addEventListener('change', getValue);
Krec.addEventListener('change', getValue);
altura.addEventListener('change', getValue);
Watt.addEventListener('change', getValue);

function getValue() {
  const comp4 = +l4.value;
  const vazao = q.value / 1000;
  const leqsuc = +Lsuc.value;
  const fatorKsuc = +Ksuc.value;
  const leqrec = +Lrec.value;
  const fatorKrec = +Krec.value;
  const alturaMano = +altura.value;
  const potencia = +Watt.value;
  const tempo = +t.innerText;
  const dRec = Math.floor(calcTubulacao(vazao, tempo) * 1000);
  const diametros = calcDiametros(dRec);
  const vRec = calcVelocidade(vazao, diametros[0], diametros[1])[0];
  const vSuc = calcVelocidade(vazao, diametros[0], diametros[1])[1];
  const moodySuc = calcMoodySuc(rugosidade, diametros[1]);
  const resuc = calcReSuc(vSuc, diametros[1], viscosidade);
  const moodyRec = calcMoodySuc(rugosidade, diametros[0]);
  const reRec = calcReSuc(vRec, diametros[0], viscosidade);
  const haalandsuc = calcHaalandSuc(moodySuc, resuc);
  const haalandrec = calcHaalandSuc(moodyRec, reRec);
  const perdaSuc = perdaDeCargaSuc(
    haalandsuc,
    leqsuc,
    diametros[1],
    fatorKsuc,
    vSuc,
    gravidade
  );
  const perdaRec = perdaDeCargaRec(
    haalandrec,
    leqrec,
    diametros[0],
    fatorKrec,
    vRec,
    gravidade,
    comp4
  );
  const alturaManometrica = calcAlturaManometrica(comp4, perdaSuc, perdaRec);
  const vazaoConvertida = convertVazao(vazao);
  const rendimento = calcRendimento(vazao, alturaMano, potencia);
  const NPSH = calcNPSH(perdaRec, perdaSuc);

  createElements(
    dRec,
    diametros[0],
    diametros[1],
    vRec.toFixed(2),
    vSuc.toFixed(2),
    reRec.toFixed(2),
    resuc.toFixed(2),
    moodyRec.toFixed(7),
    moodySuc.toFixed(7),
    haalandrec.toFixed(3),
    haalandsuc.toFixed(3),
    perdaRec.toFixed(2),
    perdaSuc.toFixed(2),
    alturaManometrica.toFixed(2),
    vazaoConvertida.toFixed(2),
    rendimento.toFixed(2),
    NPSH.toFixed(2)
  );
}

function calcTubulacao(vazao, tempo) {
  const dRec = 1.3 * Math.sqrt(vazao) * Math.pow(tempo / 24, 0.25);
  return dRec;
}

function calcDiametros(dRec) {
  let diametroComercial = 0;
  let diametroSuc = 0;
  dComercial.forEach((diametro, index) => {
    if (dRec > diametro && dRec < dComercial[index + 1]) {
      diametroComercial = dComercial[index + 1];
      diametroSuc = dComercial[index + 2];
    }
  });
  return [diametroComercial, diametroSuc];
}

function calcVelocidade(vazao, diametroRec, diametroSuc) {
  const vRec = vazao / (0.7854 * Math.pow(diametroRec / 1000, 2));
  const vSuc = vazao / (0.7854 * Math.pow(diametroSuc / 1000, 2));
  return [vRec, vSuc];
}

function calcMoodySuc(rugosidade, diametroSuc) {
  const moodySuc = rugosidade / diametroSuc;
  return moodySuc;
}
function calcReSuc(velocidade, diametroSuc, viscosidade) {
  const reSuc = (velocidade * (diametroSuc / 1000)) / viscosidade;
  return reSuc;
}
function calcHaalandSuc(moodySuc, re) {
  const calcLog = -1.8 * Math.log10(Math.pow(moodySuc / 3.7, 1.11) + 6.9 / re);
  const calcPt2 = Math.pow(calcLog, 2);
  const haaland = 1 / calcPt2;
  return haaland;
}

function perdaDeCargaSuc(
  haaland,
  Leqsuc,
  diametroSuc,
  fatorKsuc,
  vSuc,
  gravidade
) {
  const diametroConv = diametroSuc / 1000;
  const partOne = (8 + Leqsuc) * haaland;
  const perdaSuc =
    (partOne / diametroConv + fatorKsuc) *
    (Math.pow(vSuc, 2) / (2 * gravidade));
  return perdaSuc;
}
function perdaDeCargaRec(
  haaland,
  Leqrec,
  diametrorec,
  fatorKrec,
  vrec,
  gravidade,
  l4
) {
  const diametroConv = diametrorec / 1000;
  const partOne = (12 + l4 + Leqrec) * haaland;
  const perdarec =
    (partOne / diametroConv + fatorKrec) *
    (Math.pow(vrec, 2) / (2 * gravidade));
  return perdarec;
}

function calcAlturaManometrica(l4, perdaSuc, perdarec) {
  const alturaManometrica = 2 + l4 + perdaSuc + perdarec;
  return alturaManometrica;
}

function convertVazao(vazao) {
  const vazaoConvertida = vazao * 3.6 * 1000;
  return vazaoConvertida;
}

function calcRendimento(vazao, altura, potencia) {
  const rendimento = ((9720 * vazao * altura) / potencia) * 100;
  return rendimento;
}

function calcNPSH(perdaRec, perdaSuc) {
  const NPSH = 9.7 - 2.4 - 2 - perdaRec - perdaSuc;
  return NPSH;
}

function createElements(
  dRec,
  diametrorec,
  diametrosuc,
  vRec,
  vSuc,
  rerec,
  resuc,
  moodyRec,
  moodySuc,
  haalandrec,
  haalandsuc,
  perdaRec,
  perdaSuc,
  alturaManometrica,
  vazaoConvertida,
  rendimento,
  NPSH
) {
  result.removeChild(result.lastChild);
  const wrapper = document.createElement('div');

  wrapper.innerHTML = `
    <h3>Calculo de Diametros</h3>
    <p>Diametro Calculado: ${dRec}mm</p>
    <p>Diametro Recalque: ${diametrorec}mm</p>
    <p>Diametro Sucção: ${diametrosuc}mm</p>
    <br>
    <h3>Velocidades</h3>
    <p>Velocidade Recalque: ${vRec}m/s</p>
    <p>Velocidade Sucção: ${vSuc}m/s</p>
    <h3>Moody</h3>
    <p>Moody Recalque: ${moodyRec}</p>
    <p>Moody Sucção: ${moodySuc}</p>
    <h3>Reynolds</h3>
    <p>Reynolds Recalque: ${rerec}</p>
    <p>Reynolds Sucção: ${resuc}</p>
    <h3>Haaland</h3>
    <p>Haaland Recalque: ${haalandrec}</p>
    <p>Haaland Sucção: ${haalandsuc}</p>
    <h3>Perda de Carga</h3>
    <p>Perda de Carga Recalque: ${perdaRec}m</p>
    <p>Perda de Carga Sucção: ${perdaSuc}m</p>
    <h3>Altura Manométrica</h3>
    <p>H<sub>bomba</sub>: ${alturaManometrica}m</p>
    <p>Para seleção da bomba utilizar H<sub>b</sub> = ${alturaManometrica}m e Q = ${vazaoConvertida}m³/h</p>
    <h3>Rendimento do Motor e Cavitação</h3>
    <p>Rendimento: ${rendimento}%</p>
    <p>NPSH<sub>disp</sub>: ${NPSH}m</p>
    `;
  result.appendChild(wrapper);
}
