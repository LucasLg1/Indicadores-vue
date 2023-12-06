<template>

        <div style="display: flex; flex-flow: row;align-content: center ;justify-content: center; margin: 2rem 0 0 0;" class="form-check">
            <button @click="getClienteAno()" style="background-color: transparent; border:none; font-size: larger;">
                <i class="bi bi-calendar-minus"></i>
            </button>
                    <div v-for="i in nomeDosMeses" :key="i">
                    <input @change="getClienteMes()" type="radio" class="btn-check" name="options-base" :id=i.id :value=i.id v-model="mes" autocomplete="off">
                    <label class="btn" :for=i.id>{{ i.nome }}</label>
                </div>
            </div>
            <hr>
        <div style="display: flex ;width: 1fr; margin-top: 1rem; padding: 1rem;justify-content: center;">
            <canvas id="ChartClientes" width="1300" height="200" ></canvas>
        </div>
        <div style="display: flex ;width: 1fr; margin-top: 1rem; padding: 1rem;justify-content: center;">
            <canvas id="ChartTickets" width="1300" height="200" ></canvas>
        </div>

        <div class="modal-mask" v-if="showModal" @click="fecharModalFora">
            <div class="modal-container">
                <div style="display: flex; flex-flow: column; background-color: rgb(255, 255, 255); height: fit-content; width: fit-content ;padding: 1rem; border-radius: 10px;">
                <h1 style="text-align: center;">Clientes:
                    <hr>
                </h1>
                    <ul>
                        <li style="margin-top: 0.5rem;margin-right: 1rem;" v-for="c in clientes" :key="c">
                            {{ c }}
                        </li>       
                    </ul>
                </div>
            </div>
        </div>
        {{ mes }}
        {{ dadostickets }}
 
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';

export default {
    data() {
        return {
            showModal: false,
            clientes:"",
            mesSemana:"",
            semana:"",
            data:"",
            dataX:"",
            mes:"04",
            ano:"2023",
            dados: '',
            dadostickets:'',
            nomeDosMeses: [{"id":1,"nome":'Janeiro'},
            {"id":2,"nome":'Fevereiro'},
            {"id":3,"nome":'Março'},
            {"id":4,"nome":'Abril'},
            {"id":5,"nome":'Maio'},
            {"id":6,"nome":'Junho'},
            {"id":7,"nome":'Julho'},
            {"id":8,"nome":'Agosto'},
            {"id":9,"nome":'Setembro'},
            {"id":10,"nome":'Outubro'},
            {"id":11,"nome":'Novembro'},
            {"id":12,"nome":'Dezembro'}],
            dataGrafico: {},
            dataGraficoTickets: {},
            labels:[],
            labelsTickets:[],
            datasets: [],
            datasetsTickets: [],
        }},
    mounted() {
        this.getClienteAno()
        this.getTicketsAno()
},
    methods: {
        abrirModal() {
            // axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-conquistado/detalhe', {
            //     anoSemana: this.ano+this.semana,
            // })
            // .then((response) => {
            //     this.clientes = response.data;
            //     this.clientes = this.clientes.map((item) => item.cDesOp);
            //     console.log(response);
            //     console.log(this.clientes);
            //     })

            //     .catch((error) => {
            //         console.error(error);
            //     });
            this.showModal = !this.showModal;
            },
        fecharModalFora(event) {
            if (event.target.classList.contains('modal-mask')) {
                this.showModal = false;
                this.showModalSprint = false;
            }
            },
        calcularMesDaSemana() {
                const data = new Date(this.ano, 0, 1);
                data.setDate(data.getDate() + (this.semana - 1) * 7);
                this.MesSemana = data.getMonth() + 1;
            },
        getClienteMes() { 
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-conquistado', {
                mes: this.mes,
                ano: this.ano,
            })
            .then((response) => {
                this.dados = response.data;
                this.dados.forEach((item, index) => {
                    item.semana = index + 1 + "º Semana";
                });
                this.labels = this.dados.map((item) => item.semana);
                this.dataGrafico = this.dados.map((item) => item.regSemana);
                this.datasets = [];
                this.datasets.push({
                        type: 'line',
                        label: 'Meta',
                        backgroundColor: 'green',
                        borderColor: 'green',
                        pointRadius: 0,
                        borderWidth: 1,
                        data: [10, 10, 10, 10, 10]
                    },{
                        data: this.dataGrafico,
                        type:'line',
                        label: 'Clientes Conquistados',
                        backgroundColor: 'black',
                        borderColor: 'black',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    })

                this.renderChartClientes();
                })
                .catch((error) => {
                    console.error(error);
                });
            },
        getClienteAno() {
            this.mes = "";
          axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-conquistado', {
              ano: this.ano,
            })
            .then((response) => {
                this.dados = response.data;
                this.dados.forEach((item, index) => {
                    item.semana = index + 1 + 'º';
                });
                this.labels = this.dados.map((item) => item.semana);
                this.dataGrafico = this.dados.map((item) => item.regSemana);
                this.datasets = [];
                this.datasets.push({
                    data: this.dataGrafico,
                    type:'line',
                    label: 'Clientes Conquistados',
                    backgroundColor: 'black',
                    borderColor: 'black',
                    borderWidth: 1.5,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    })
            
                    this.renderChartClientes()
                })
                .catch((error) => {
                    console.error(error);
                });
            },
        renderChartClientes() {
            const canvas = document.getElementById('ChartClientes');
            const ctx = canvas.getContext('2d');
    
            if (canvas.chart) {
                canvas.chart.destroy();
            }
    
            canvas.chart = new Chart(ctx, {
                data: {
                    labels: this.labels,
                    datasets: this.datasets,
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                     onClick: (e) => {
                        if(this.mes == "") {
                        const canvasPosition = getRelativePosition(e, canvas.chart);
                        const dataX = canvas.chart.scales.x.getValueForPixel(canvasPosition.x);

                        this.semana = dataX + 1;
                        if (this.semana < 10) {
                        this.semana = "0" + this.semana
                        }
                        this.calcularMesDaSemana();
                        this.mes = this.MesSemana;
                        this.getClienteMes();
                        }
                    }
                },
            });
            },
        getTicketsAno() {
          axios.post('http://192.168.0.6:8000/api/omie/oportunidade/ticket', {
            mes: this.mes,
            ano: this.ano,
            })
            .then((response) => {
                this.dadosTickets = response.data;
                console.log(response);
                console.log(this.dadosTickets);
                // this.labelsTickets = this.dadosTickets.map((item) => item.semana);
                // this.dataGraficoTickets = this.dadosTickets.map((item) => item.regSemana);
                // this.datasetsTickets = [];
                // this.datasetsTickets.push({
                //     data: this.dataGraficoTickets,
                //     type:'line',
                //     label: 'Tickets',
                //     backgroundColor: 'orange',
                //     borderColor: 'orange',
                //     borderWidth: 1.5,
                //         tension: 0.3,
                //         pointRadius: 2.2,
                //         pointHoverRadius: 5,
                //     })
            
                //     this.renderChartTickets()
                })
                .catch((error) => {
                    console.error(error);
                });
            },
            renderChartTickets() {
            const canvas = document.getElementById('ChartTickets');
            const ctx = canvas.getContext('2d');
    
            if (canvas.chart) {
                canvas.chart.destroy();
            }
    
            canvas.chart = new Chart(ctx, {
                data: {
                    labels: this.labelsTickets,
                    datasets: this.datasetsTickets,
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    //  onClick: (e) => {
                    //     if(this.mes == "") {
                    //     const canvasPosition = getRelativePosition(e, canvas.chart);
                    //     const dataX = canvas.chart.scales.x.getValueForPixel(canvasPosition.x);

                    //     this.semana = dataX + 1;
                    //     if (this.semana < 10) {
                    //     this.semana = "0" + this.semana
                    //     }
                    //     this.calcularMesDaSemana();
                    //     this.mes = this.MesSemana;
                    //     this.getClienteMes();
                    //     }
                    // }
                },
            });
            },


}   
}
</script>

<style>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(65, 62, 62, 0.7);
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
}
</style>