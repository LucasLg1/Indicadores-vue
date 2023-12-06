<template>
    
    <div>
    
        <GraficosView :mes="mes" :ano="ano" :data="data" :meses="meses"/>

    </div>
</template>

<script>
import axios from 'axios'
import GraficosView from './GraficosView.vue'

export default {
    data() {
        return {
            meses: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Julho', 'Junho'],
            mes: '05',
            ano: '2023',
            data: ''
        };
    },
    methods: {
        buscarDados() {
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-conquistado', {
                    mes: this.mes,
                    ano: this.ano
                }).then(response => {
                    this.data = response;
                    console.log(this.data);
                })
                .catch(error => {
                    console.error(error);
                });
        },
    },
    mounted() {
        this.buscarDados();
    },
    components: { GraficosView }
}
</script>