## Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/)


Para clonar este repositório, siga os passos abaixo:

1. Abra o terminal.
2. Navegue até o diretório onde você deseja clonar o repositório.
3. Execute o seguinte comando:

   ```bash
   git clone https://github.com/LuanLgn/Cep_e_Clima.git

cd Cep_e_Clima

# Para rodar abre um terminal dessa pasta e execute esses comandos:

- npm create vite@latest
- npm install -g npm@10.9.0
- npm install vite
- npm run dev


Em React Native, o código ficaria +/- assim, mas pede pro GPT adaptar pro seu cenário

```bash
   import React, { useState } from 'react';
   import { View, Text, TextInput, Button, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
   
   const App = () => {
     const [cep, setCep] = useState('');
     const [data, setData] = useState(null);
     const [loading, setLoading] = useState(false);
   
     const buscarDadosCep = async () => {
       if (!cep) return;
   
       setLoading(true);
       try {
         const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
         const cepData = await response.json();
   
         if (cepData.erro) {
           alert('CEP inválido');
           setLoading(false);
           return;
         }
   
         const cidade = cepData.localidade;
         const climaResponse = await fetch(`https://wttr.in/${cidade}?format=j1&lang=pt`);
         const climaData = await climaResponse.json();
   
         if (!climaData.current_condition || !climaData.weather) {
           throw new Error('Dados climáticos não disponíveis.');
         }
   
         const info = {
           cidade: cepData.localidade,
           logradouro: cepData.logradouro,
           bairro: cepData.bairro,
           estado: cepData.uf,
           temperaturaMinima: climaData.current_condition[0]?.temp_C || 'N/A',
           temperaturaMaxima: climaData.current_condition[0]?.temp_C || 'N/A',
           chanceChuva: climaData.current_condition[0]?.chanceofrain || 'N/A',
           dataAtual: new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
           descricaoAtual: climaData.current_condition[0]?.lang_pt[0]?.value || 'Descrição não disponível',
           previsao: climaData.weather
             .slice(1, 6) // Começa a partir do próximo dia, limitando a 5 dias
             .map((dia) => ({
               data: dia.date,
               descricao: dia.lang_pt && dia.lang_pt[0] ? dia.lang_pt[0].value : 'Descrição não disponível',
               temperaturaMinima: dia.mintempC,
               temperaturaMaxima: dia.maxtempC,
               chanceChuva: dia.hourly[0]?.chanceofrain || 'N/A',
             })),
         };
   
         setData(info);
       } catch (error) {
         console.error('Erro ao buscar os dados:', error);
         alert(`Erro ao buscar os dados: ${error.message}`);
       } finally {
         setLoading(false);
       }
     };
   
     return (
       <View style={styles.container}>
         <Text style={styles.title}>Consulta CEP e Clima</Text>
         <TextInput
           style={styles.input}
           placeholder="Digite o CEP"
           value={cep}
           onChangeText={setCep}
         />
         <Button title="Buscar" onPress={buscarDadosCep} disabled={loading} />
   
         {loading && <ActivityIndicator size="large" color="#0000ff" />}
   
         {data && (
           <ScrollView style={styles.results}>
             <Text style={styles.city}>Previsão do tempo para {data.cidade}</Text>
             <Text>{data.logradouro}, {data.bairro} - {data.estado}</Text>
             {data.previsao.map((dia, index) => (
               <View key={index} style={styles.weatherDay}>
                 <Text style={styles.date}>
                   {new Date(dia.data).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                 </Text>
                 <Text>Descrição: {data.descricaoAtual}</Text>
                 <Text>Temperatura Mínima: {dia.temperaturaMinima} °C | Temperatura Máxima: {dia.temperaturaMaxima} °C</Text>
                 <Text>Chance de Chuva: {dia.chanceChuva}%</Text>
               </View>
             ))}
           </ScrollView>
         )}
       </View>
     );
   };
   
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       padding: 20,
       backgroundColor: '#fff',
     },
     title: {
       fontSize: 24,
       fontWeight: 'bold',
       marginBottom: 20,
     },
     input: {
       height: 40,
       borderColor: '#ccc',
       borderWidth: 1,
       marginBottom: 20,
       paddingHorizontal: 10,
     },
     results: {
       marginTop: 20,
     },
     city: {
       fontSize: 18,
       fontWeight: 'bold',
       marginBottom: 10,
     },
     weatherDay: {
       marginBottom: 15,
       padding: 10,
       borderColor: '#ccc',
       borderWidth: 1,
       borderRadius: 5,
     },
     date: {
       fontSize: 16,
       fontWeight: 'bold',
     },
   });
   
   export default App;


