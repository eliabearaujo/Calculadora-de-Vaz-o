const chartsArea = document.querySelector('.charts');

let date = new Date();
let hoje = date.getDay();
console.log(hoje);

//Fetch JSON
async function fecthData() {
  const dataPromise = await fetch('./data.json');
  const data = await dataPromise.json();
  generateBars(data);
}

async function generateBars(elementList) {
  elementList.forEach((element) => {
    const chart = document.createElement('div');
    chart.classList.add('chart');
    chart.innerHTML = `
    <div class="amount" style="display:none">$${element.amount}</div>
    <div class="bar" style="height:${element.amount * 1.5}%"></div>
    <div class="title">${element.day}</div>
    `;
    chartsArea.appendChild(chart);
  });
  const bars = document.querySelectorAll('.bar');
  const amounts = document.querySelectorAll('.amount');
  bars.forEach((bar, index) => {
    bar.addEventListener('mouseover', () => {
      amounts[index].style.display = 'block';
    });
    bar.addEventListener('mouseleave', () => {
      amounts[index].style.display = 'none';
    });
  });

  if (hoje == 0) {
    bars[6].style.backgroundColor = 'hsl(186, 34%, 60%)';
  } else {
    bars[hoje - 1].style.backgroundColor = 'hsl(186, 34%, 60%)';
  }
}

fecthData();
