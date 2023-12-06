<template> 
    <div style="display: flex; flex-flow: row; width: 1fr; flex-wrap: wrap; justify-content: center;">
      <div style="margin: 0.5rem;">
        <canvas id="myChart" width="1300" height="200"></canvas> 
      </div>        
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Chart from 'chart.js/auto';
  
  export default {
    data() {
      return {
        data: '',
        mes: '',
        ano: '2023',
        dados: [],
        teste: [],
      };
    },
  
    methods: {
      getAll2() {
          axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-conquistado', {
              ano: this.ano,
            })
            .then((response) => {
                this.dados = response.data;
                this.dados.forEach((item, index) => {
                        item.semana = index + 1 + 'º';
                        });
                console.log(response);
                console.log(this.dados);
                this.renderCharts()
            })
            .catch((error) => {
              console.error(error);
            });
      },
      renderCharts2() {
          const labels = this.dados.map((item) => item.semana);
          const dataGrafico = this.dados.map((item) => item.regSemana);
          const ctx = document.getElementById('myChart').getContext('2d');
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'Clientes Conquistados',
                  data: dataGrafico,
                  backgroundColor: 'black',
                  borderColor: 'black',
                  borderWidth: 1,
                }],
              options: {
                    responsive: false,
                    maintainAspectRatio: false,
                }
              }
            })
          },
        },
  
    mounted() {
      this.getAll(); 
  }
}
  </script>