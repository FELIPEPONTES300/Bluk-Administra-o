

import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// FIX: Corrected Firebase imports to use the v9 compatibility layer ('compat') which provides the v8 namespaced API. This resolves errors where properties like 'apps', 'initializeApp', and 'firestore' were not found on the imported 'firebase' object.
// Firebase v8 compat SDK imports
import firebase from "firebase/compat/app";
import "firebase/compat/analytics";
import "firebase/compat/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjmyiCSP7SSjR50cyUQKDU6tNxeq9TbiE",
  authDomain: "bluk-administrator.firebaseapp.com",
  projectId: "bluk-administrator",
  storageBucket: "bluk-administrator.firebasestorage.app",
  messagingSenderId: "353101903400",
  appId: "1:353101903400:web:bdb99fe1b88432cd74e71d",
  measurementId: "G-RKFYGNMZYN"
};

// FIX: Updated Firebase initialization to v8 syntax.
// Initialize Firebase with v8 namespaced syntax
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const analytics = firebase.analytics();
const db = firebase.firestore();


// Fix for jsPDF library loaded from CDN
// This declares the jspdf property on the global window object for TypeScript.
declare global {
  interface Window {
    jspdf: any;
    autoTable: any; // Plugin for jsPDF
  }
}

const BLUK_LOGO_BASE64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/wAARCAEOAeMDASIAAhEBAxEB/8QAGwABAQACAwEAAAAAAAAAAAAAAAEGBwIDBAX/xABBEAABAwIFAgMGBQIEBQUAAAABAAIDBBEFEiExQQYHEyJRYXGBkRSRobHBMhQjQlLwFiRicpLh8URTY4Ky0jVD/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAECAwQF/8QAIREBAQEAAgICAwEBAQAAAAAAAAABEQIhMRIDQSIyQVH/2gAMAwEAAhEDEQA/APxgiIpCIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIi-hhR1I5gIixQIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIi'

const COLORS = {
  primary: '#D50000', // Red from logo
  background: '#111111',
  surface: '#1E1E1E',
  textPrimary: '#FFFFFF',
  textSecondary: '#A9A9A9',
  border: '#333333',
  white: '#FFFFFF',
  success: '#2ECC71',
  error: '#E74C3C',
};

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// --- Helper Functions ---
const formatCurrency = (value) => {
  if (isNaN(value) || value === null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const parseCurrency = (value) => {
  if (typeof value !== 'string' || !value) return 0;
  const number = parseFloat(value.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, ''));
  return isNaN(number) ? 0 : number;
};

const formatCurrencyOnChange = (value) => {
    if (!value) return '';
    let digits = value.replace(/\D/g, '');
    if (digits === '') return '';
    const numberValue = parseInt(digits, 10) / 100;
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
    }).format(numberValue);
};

const numeroPorExtenso = (valor) => {
    valor = parseFloat(valor).toFixed(2);
    let [inteiro, centavos] = valor.split('.').map(v => parseInt(v, 10));

    const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const especiais = ['dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

    const getExtenso = (num) => {
        if (num === 0) return '';
        if (num < 10) return unidades[num];
        if (num < 20) return especiais[num - 10];
        if (num < 100) return dezenas[Math.floor(num / 10)] + (num % 10 !== 0 ? ' e ' + unidades[num % 10] : '');
        if (num === 100) return 'cem';
        if (num < 1000) return centenas[Math.floor(num / 100)] + (num % 100 !== 0 ? ' e ' + getExtenso(num % 100) : '');
        return '';
    };

    if (inteiro === 0 && centavos === 0) return 'zero reais';

    let inteiroStr = '';
    if (inteiro > 0) {
        if (inteiro >= 1000000) {
            const milhoes = Math.floor(inteiro / 1000000);
            inteiroStr += getExtenso(milhoes) + (milhoes > 1 ? ' milhões' : ' milhão');
            inteiro %= 1000000;
            if (inteiro > 0) inteiroStr += ' e ';
        }
        if (inteiro >= 1000) {
            const mil = Math.floor(inteiro / 1000);
            inteiroStr += (mil > 1 ? getExtenso(mil) : '') + ' mil';
            inteiro %= 1000;
            if (inteiro > 0) inteiroStr += ' e ';
        }
        if (inteiro > 0) {
            inteiroStr += getExtenso(inteiro);
        }
        inteiroStr += ' ' + (parseInt(valor) > 1 ? 'reais' : 'real');
    }

    let centavosStr = '';
    if (centavos > 0) {
        centavosStr = getExtenso(centavos) + ' ' + (centavos > 1 ? 'centavos' : 'centavo');
    }

    if (inteiroStr && centavosStr) return `${inteiroStr} e ${centavosStr}`;
    return inteiroStr || centavosStr;
};


// --- Components ---
const Header = () => (
  <header className="py-4 px-4 sm:px-8 bg-black flex justify-center sm:justify-start shadow-lg">
    <img src={BLUK_LOGO_BASE64} alt="Bluk Logo" className="h-12" />
  </header>
);

const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    const baseStyle = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white text-sm z-50 animate-fade-in flex items-center gap-4';
    const typeStyle = type === 'success' ? 'bg-green-600' : 'bg-red-600';

    useEffect(() => {
        const timer = setTimeout(onClose, 5000); // Auto-dismiss after 5 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`${baseStyle} ${typeStyle}`}>
            <span>{message}</span>
            <button onClick={onClose} className="font-bold opacity-70 hover:opacity-100">&times;</button>
        </div>
    );
};

const App = () => {
  const [nome, setNome] = useState('');
  const [filial, setFilial] = useState('');
  const [comissoes, setComissoes] = useState(
    MESES.reduce((acc, mes) => ({ ...acc, [mes]: '' }), {})
  );
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('calculator'); // 'calculator', 'history', or 'relatorios'
  const [historico, setHistorico] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [editingId, setEditingId] = useState(null);
  const [ajudaDeCusto, setAjudaDeCusto] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear().toString());

  // Filters for history
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroFilial, setFiltroFilial] = useState('');
  const [filtroAno, setFiltroAno] = useState('');

  // Reports state
  const [filiaisDisponiveis, setFiliaisDisponiveis] = useState<string[]>([]);
  const [filtroFilialRelatorio, setFiltroFilialRelatorio] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [dadosRelatorio, setDadosRelatorio] = useState([]);
  
  // FIX: Updated Firestore collection reference to v8 syntax.
  const historyCollectionRef = db.collection('calculo13Historico');
  
  const fetchHistory = async (loadMore = false) => {
    if (loading) return;
    setLoading(true);

    try {
        let q = historyCollectionRef.orderBy('createdAt', 'desc').limit(10);

        if (loadMore && lastDoc) {
            q = q.startAfter(lastDoc);
        }

        const querySnapshot = await q.get();
        const newHistoryData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const date = data.createdAt ? data.createdAt.toDate() : new Date();
            return {
                id: doc.id,
                data: date.toLocaleDateString('pt-BR'),
                resultado: data.resultado
            };
        });

        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHistorico(prev => loadMore ? [...prev, ...newHistoryData] : newHistoryData);
        setHasMore(querySnapshot.docs.length === 10);

        if (!loadMore) {
            const allHistorySnapshot = await historyCollectionRef.get();
            const allFiliais = [...new Set(allHistorySnapshot.docs.map(doc => doc.data().resultado.filial))];
            setFiliaisDisponiveis(allFiliais.sort() as string[]);
        }

    } catch (e) {
        console.error("Failed to load history from Firestore", e);
        setNotification({ message: 'Erro ao carregar histórico.', type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleComissaoChange = (mes, value) => {
    setError('');
    const formattedValue = formatCurrencyOnChange(value);
    setComissoes(prev => ({ ...prev, [mes]: formattedValue }));
  };
  
  const handleCalculate = async () => {
    const trimmedName = nome.trim();
    if (!trimmedName) {
      setError('Por favor, informe o nome do funcionário.');
      return;
    }
    if (!filial) {
      setError('Por favor, informe o nome da filial.');
      return;
    }

    const parsedComissoes = MESES.reduce((acc, mes) => ({
      ...acc,
      [mes]: parseCurrency(comissoes[mes]),
    }), {} as Record<string, number>);
    
    const hasAnyValue = Object.values(parsedComissoes).some(val => val > 0);
    if (!hasAnyValue) {
        setError('Preencha o valor de comissão de pelo menos um mês.');
        return;
    }

    setError('');

    // --- Calculations ---
    let parcela1 = { calculado: false, valor: 0, soma: 0, media: 0 };
    const mesesP1 = MESES.slice(0, 10);
    const hasAllMonthsP1 = mesesP1.every(mes => comissoes[mes] !== '');
    if (hasAllMonthsP1) {
        const soma = mesesP1.reduce((sum, mes) => sum + parsedComissoes[mes], 0);
        const media = soma / 10;
        const valor = media / 2;
        parcela1 = { calculado: true, soma, media, valor };
    }

    let parcela2 = { calculado: false, valor: 0, soma: 0, media: 0 };
    const mesesP2 = MESES.slice(0, 11);
    const hasAllMonthsP2 = mesesP2.every(mes => comissoes[mes] !== '');
    if (hasAllMonthsP2) {
        const soma = mesesP2.reduce((sum, mes) => sum + parsedComissoes[mes], 0);
        const media = soma / 11;
        const valor = media / 2;
        parcela2 = { calculado: true, soma, media, valor };
    }

    let parcela3 = { calculado: false, valor: 0, soma: 0, media: 0 };
    const mesesP3 = MESES.slice(0, 12);
    const hasAllMonthsP3 = mesesP3.every(mes => comissoes[mes] !== '');
    if (hasAllMonthsP3) {
        const soma = mesesP3.reduce((sum, mes) => sum + parsedComissoes[mes], 0);
        const media = soma / 12; // Calculo 3
        const valor = media - (parcela1.valor + parcela2.valor);
        parcela3 = { calculado: true, soma, media, valor };
    }

    const total = (parcela1.calculado ? parcela1.valor : 0) + 
                  (parcela2.calculado ? parcela2.valor : 0) + 
                  (parcela3.calculado ? parcela3.valor : 0);

    const newResultado = {
      nome: trimmedName,
      filial,
      ano,
      comissoes: parsedComissoes,
      parcela1,
      parcela2,
      parcela3,
      totalGeral: hasAllMonthsP3 ? parcela3.soma / 12 : total,
      ajudaDeCusto: parseCurrency(ajudaDeCusto)
    };
    
    setResultado(newResultado);

    // --- Save to Firestore (Update or Create) ---
    const historyEntryData = {
        resultado: newResultado,
        // FIX: Updated serverTimestamp to v8 syntax.
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    
    try {
        if (editingId) {
            // Update existing document
            // FIX: Updated document reference and update call to v8 syntax.
            const docRef = db.collection('calculo13Historico').doc(editingId);
            await docRef.update({
                resultado: newResultado,
                createdAt: firebase.firestore.FieldValue.serverTimestamp() // Also update the timestamp
            });
            
            // Update local state
            setHistorico(historico.map(item => 
                item.id === editingId 
                ? { ...item, resultado: newResultado, data: new Date().toLocaleDateString('pt-BR') } 
                : item
            ).sort((a, b) => {
              const dateA = new Date(a.data.split('/').reverse().join('-')).getTime();
              const dateB = new Date(b.data.split('/').reverse().join('-')).getTime();
              return dateB - dateA;
            }));
            setNotification({ message: 'Cálculo atualizado com sucesso!', type: 'success' });
            
        } else {
            // Check for duplicates before creating a new one (same name AND same year)
            const existingEntry = historico.find(item => 
                item.resultado.nome.toLowerCase() === trimmedName.toLowerCase() && 
                item.resultado.ano === ano
            );
            if(existingEntry) {
                 setError(`Já existe um cálculo para '${trimmedName}' no ano de ${ano}. Carregue-o do histórico para editar.`);
                 setResultado(null); // stay on form
                 return;
            }

            // Create new entry
            // FIX: Updated add document call to v8 syntax.
            const docRef = await historyCollectionRef.add(historyEntryData);
            const newHistoryEntryForState = {
                id: docRef.id,
                data: new Date().toLocaleDateString('pt-BR'),
                resultado: newResultado,
            };
            setHistorico(prev => [newHistoryEntryForState, ...prev]);
            setNotification({ message: 'Cálculo salvo com sucesso!', type: 'success' });
        }
    } catch (e) {
        console.error("Error saving document: ", e);
        setError('Falha ao salvar o cálculo no histórico.');
        setNotification({ message: 'Erro ao salvar no banco de dados.', type: 'error' });
    }
  };
  
  const handleNewCalculation = () => {
    setNome('');
    setFilial('');
    setAno(new Date().getFullYear().toString());
    setComissoes(MESES.reduce((acc, mes) => ({ ...acc, [mes]: '' }), {}));
    setResultado(null);
    setError('');
    setEditingId(null);
    setAjudaDeCusto('');
  };

  const handleLoadFromHistory = (historyItem) => {
    const { resultado, id } = historyItem;
    setNome(resultado.nome);
    setFilial(resultado.filial);
    setAno(resultado.ano || new Date().getFullYear().toString());

    const formattedComissoes = MESES.reduce((acc, mes) => {
        const value = resultado.comissoes[mes];
        acc[mes] = value > 0 ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value) : '';
        return acc;
    }, {});

    setComissoes(formattedComissoes);
    setAjudaDeCusto(resultado.ajudaDeCusto ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(resultado.ajudaDeCusto) : '');
    setEditingId(id);
    setResultado(null); // Go back to form view
    setViewMode('calculator');
  };

  const handleDeleteFromHistory = async (idToDelete) => {
    try {
        // FIX: Updated document reference and delete call to v8 syntax.
        const docRef = db.collection('calculo13Historico').doc(idToDelete);
        await docRef.delete();
        setHistorico(prevHistorico => prevHistorico.filter(item => item.id !== idToDelete));
        setNotification({ message: 'Cálculo excluído com sucesso!', type: 'success' });
    } catch (e) {
        console.error("Error deleting document: ", e);
        setNotification({ message: 'Falha ao excluir o cálculo.', type: 'error' });
    }
  };
  
    const handleGenerateRecibo = () => {
        if (!resultado) return;
        
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert('Erro: A biblioteca de geração de PDF (jsPDF) não foi carregada. Por favor, recarregue a página e tente novamente.');
            console.error("jsPDF library not found on window.jspdf");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a5' });
        
        const docWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        let yPos = 20;

        // --- Title ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('RECIBO', docWidth / 2, yPos, { align: 'center' });
        yPos += 20;

        // --- Body ---
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        
        const valorTotal = resultado.totalGeral;
        const valorFormatado = formatCurrency(valorTotal);
        const valorPorExtensoStr = numeroPorExtenso(valorTotal);

        const mesAnoReferencia = `${resultado.ano || new Date().getFullYear()}`;

        const textoRecibo = `Recebi do(s) Sr(s): WK CONFECÇOES LTDA a importância de ${valorFormatado} (${valorPorExtensoStr}), referente a serviços prestados em ${mesAnoReferencia}.
        
Pelo que para maior clareza firmo o presente.`;

        const splitText = doc.splitTextToSize(textoRecibo, docWidth - (margin * 2));
        doc.text(splitText, margin, yPos);
        
        const textHeight = doc.getTextDimensions(splitText).h;
        yPos += textHeight + 25;

        // --- Date and Signature ---
        doc.text('Local e Data: _________________________________', margin, yPos);
        yPos += 15;
        doc.text('Assinatura: ___________________________________', margin, yPos);

        doc.save(`Recibo_Pagamento_${resultado.nome.replace(/\s+/g, '_')}.pdf`);
    };

  const handleExportPDF = () => {
    if (!resultado) return;
    
    // Safety check for jsPDF library
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('Erro: A biblioteca de geração de PDF (jsPDF) não foi carregada. Por favor, recarregue a página e tente novamente.');
        console.error("jsPDF library not found on window.jspdf");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    const docWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = 20;

    // --- Header ---
    doc.addImage(BLUK_LOGO_BASE64, 'JPEG', margin, yPos, 40, 12.8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(COLORS.background);
    doc.text(`Relatório de 13º Salário - Ano ${resultado.ano || ''}`, docWidth - margin, yPos + 8, { align: 'right' });
    yPos += 25;
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, yPos, docWidth - margin, yPos);
    yPos += 15;

    // --- Employee Info ---
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Funcionário(a):', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(resultado.nome, margin + 35, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Filial:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(resultado.filial, margin + 35, yPos);

    doc.setFont('helvetica', 'bold');
    doc.text('Data de Emissão:', docWidth - margin - 45, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString('pt-BR'), docWidth - margin, yPos, { align: 'right' });
    yPos += 15;

    // --- Commissions Table ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Resumo de Comissões', margin, yPos);
    yPos += 2;

    const tableColumn = ["Mês", "Valor da Comissão"];
    const tableRows = MESES.map(mes => [
        mes,
        formatCurrency(resultado.comissoes[mes]),
    ]);

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: yPos,
        theme: 'grid',
        headStyles: { fillColor: [40, 40, 40], textColor: COLORS.white },
        styles: { textColor: [50, 50, 50], cellPadding: 2, fontSize: 9 },
        margin: { left: margin, right: margin }
    });
    
    yPos = doc.autoTable.previous.finalY + 15;
    
    // --- Page Break Check Helper ---
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const checkPageBreak = (spaceNeeded) => {
      if (yPos + spaceNeeded > pageHeight - 20) { // 20 for footer margin
        doc.addPage();
        yPos = 20;
      }
    }
    
    // --- Calculation Details ---
    checkPageBreak(100); // Check if enough space for the details section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhamento dos Cálculos', margin, yPos);
    yPos += 8;

    const addParcelaToPdf = (title, data, info) => {
        checkPageBreak(40); // space needed for each parcela block
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        doc.text(title, margin, yPos);
        yPos += 6;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);

        if (!data.calculado) {
            doc.text(`Cálculo não realizado (requer valores até ${info.mes}).`, margin + 5, yPos);
            yPos += 10;
            return;
        }

        doc.text(`Soma (${info.periodo}):`, margin + 5, yPos);
        doc.text(formatCurrency(data.soma), docWidth - margin, yPos, { align: 'right' });
        yPos += 6;
        
        doc.text(`Média (Soma / ${info.divisor}):`, margin + 5, yPos);
        doc.text(formatCurrency(data.media), docWidth - margin, yPos, { align: 'right' });
        yPos += 6;

        if (info.dividePorDois) {
            doc.text('Resultado Parcial (Média / 2):', margin + 5, yPos);
            doc.text(formatCurrency(data.valor), docWidth - margin, yPos, { align: 'right' });
        }

        if (info.isResiduo) {
            const sub = resultado.parcela1.valor + resultado.parcela2.valor;
            doc.text('Subtração (1ª + 2ª parcela):', margin + 5, yPos);
            doc.text(`- ${formatCurrency(sub)}`, docWidth - margin, yPos, { align: 'right' });
        }
        yPos += 6;
        
        doc.setDrawColor(220, 220, 220);
        doc.line(margin + 5, yPos, docWidth - margin, yPos);
        yPos += 6;
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 30);
        doc.text('Valor da Parcela:', margin + 5, yPos);
        doc.text(formatCurrency(data.valor), docWidth - margin, yPos, { align: 'right' });

        yPos += 12;
    };
    
    addParcelaToPdf('1ª PARCELA', resultado.parcela1, { mes: 'Outubro', periodo: 'Jan-Out', divisor: 10, dividePorDois: true });
    addParcelaToPdf('2ª PARCELA', resultado.parcela2, { mes: 'Novembro', periodo: 'Jan-Nov', divisor: 11, dividePorDois: true });
    addParcelaToPdf('3ª PARCELA (RESÍDUO)', resultado.parcela3, { mes: 'Dezembro', periodo: 'Jan-Dez', divisor: 12, isResiduo: true });

    // --- Final Result ---
    checkPageBreak(55); // space for final result box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Resultado Final', margin, yPos);
    yPos += 8;

    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(margin, yPos, docWidth - (margin * 2), 40, 3, 3, 'FD');
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text('Primeira Parcela:', margin + 10, yPos);
    doc.text(formatCurrency(resultado.parcela1.valor), docWidth - margin - 10, yPos, { align: 'right' });
    yPos += 8;

    doc.text('Segunda Parcela:', margin + 10, yPos);
    doc.text(formatCurrency(resultado.parcela2.valor), docWidth - margin - 10, yPos, { align: 'right' });
    yPos += 8;

    doc.text('Terceira Parcela:', margin + 10, yPos);
    doc.text(formatCurrency(resultado.parcela3.valor), docWidth - margin - 10, yPos, { align: 'right' });
    yPos += 8;
    
    doc.setDrawColor(200, 200, 200);
    doc.line(margin + 10, yPos, docWidth - margin - 10, yPos);
    yPos += 8;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.primary);
    doc.text('TOTAL GERAL:', margin + 10, yPos);
    doc.text(formatCurrency(resultado.totalGeral), docWidth - margin - 10, yPos, { align: 'right' });
    
    // --- Footer ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        const footerText = `© ${new Date().getFullYear()} Bluk – Administrativo. Todos os direitos reservados.`;
        doc.text(footerText, docWidth / 2, pageHeight - 10, { align: 'center' });
    }

    doc.save(`Relatorio_13_Comissoes_${resultado.nome.replace(/\s+/g, '_')}.pdf`);
  };

  const handleGerarRelatorio = () => {
    let relatorioFiltrado = historico;

    if (filtroFilialRelatorio && filtroFilialRelatorio !== 'todas') {
        relatorioFiltrado = relatorioFiltrado.filter(item => item.resultado.filial === filtroFilialRelatorio);
    }

    const inicio = dataInicio ? new Date(dataInicio + 'T00:00:00') : null;
    const fim = dataFim ? new Date(dataFim + 'T23:59:59') : null;

    if (inicio || fim) {
      relatorioFiltrado = relatorioFiltrado.filter(item => {
        const itemDate = new Date(item.data.split('/').reverse().join('-'));
        itemDate.setHours(12,0,0,0); // Avoid timezone issues
        const afterStart = inicio ? itemDate >= inicio : true;
        const beforeEnd = fim ? itemDate <= fim : true;
        return afterStart && beforeEnd;
      });
    }
    
    setDadosRelatorio(relatorioFiltrado);
  };

  const handleExportarRelatorioPDF = () => {
      if (dadosRelatorio.length === 0) {
          setNotification({ message: 'Nenhum dado para exportar. Gere um relatório primeiro.', type: 'error' });
          return;
      }
      if (!window.jspdf || !window.jspdf.jsPDF) {
          alert('Erro: A biblioteca de geração de PDF (jsPDF) não foi carregada.');
          return;
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const docWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = 20;

      // Header
      doc.addImage(BLUK_LOGO_BASE64, 'JPEG', margin, yPos, 40, 12.8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Relatório de Comissões', docWidth - margin, yPos + 8, { align: 'right' });
      yPos += 25;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, yPos, docWidth - margin, yPos);
      yPos += 10;

      // Filter Info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Filtros Aplicados:', margin, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`Filial: ${filtroFilialRelatorio || 'Todas'}`, margin, yPos);
      doc.text(`Período: ${dataInicio ? new Date(dataInicio + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'} a ${dataFim ? new Date(dataFim + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}`, docWidth - margin, yPos, { align: 'right' });
      yPos += 10;

      // Table
      const tableColumn = ["Filial", "Funcionária", "Total (Comissão)", "Ajuda de Custo"];
      const tableRows = dadosRelatorio.map(item => [
          item.resultado.filial,
          item.resultado.nome,
          formatCurrency(item.resultado.totalGeral),
          formatCurrency(item.resultado.ajudaDeCusto || 0),
      ]);
      const totalGeralRelatorio = dadosRelatorio.reduce((sum, item) => sum + item.resultado.totalGeral, 0);
      const totalAjudaDeCusto = dadosRelatorio.reduce((sum, item) => sum + (item.resultado.ajudaDeCusto || 0), 0);

      doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: yPos,
          theme: 'grid',
          headStyles: { fillColor: [40, 40, 40], textColor: COLORS.white },
          styles: { textColor: [50, 50, 50], cellPadding: 2.5, fontSize: 9 },
          foot: [['', 'TOTAL GERAL', formatCurrency(totalGeralRelatorio), formatCurrency(totalAjudaDeCusto)]],
          footStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
          margin: { left: margin, right: margin }
      });
      
      doc.save(`Relatorio_Comissoes_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const renderFormulario = () => (
    <div className="p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-auto transition-all duration-300 animate-fade-in" style={{backgroundColor: COLORS.surface}}>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: COLORS.textPrimary }}>Cálculo de 13º por Comissão</h2>
      <p className="text-center mb-8" style={{ color: COLORS.textSecondary }}>Insira os valores de comissão de cada mês.</p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium mb-1" style={{color: COLORS.textSecondary}}>Nome do Funcionário</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => { setNome(e.target.value); setError(''); }}
                placeholder="Digite o nome completo"
                className="w-full px-4 py-3 rounded-lg transition"
                style={{backgroundColor: '#2A2A2A', border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary}}
              />
            </div>
            <div>
              <label htmlFor="filial" className="block text-sm font-medium mb-1" style={{color: COLORS.textSecondary}}>Nome da Filial</label>
              <input
                type="text"
                id="filial"
                value={filial}
                onChange={(e) => { setFilial(e.target.value); setError(''); }}
                placeholder="Digite o nome da filial"
                className="w-full px-4 py-3 rounded-lg transition"
                style={{backgroundColor: '#2A2A2A', border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary}}
              />
            </div>
            <div>
              <label htmlFor="ano" className="block text-sm font-medium mb-1" style={{color: COLORS.textSecondary}}>Ano de Referência</label>
              <input
                type="number"
                id="ano"
                value={ano}
                onChange={(e) => { setAno(e.target.value); setError(''); }}
                placeholder="Ex: 2024"
                className="w-full px-4 py-3 rounded-lg transition"
                style={{backgroundColor: '#2A2A2A', border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary}}
              />
            </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: COLORS.textSecondary}}>Valores de Comissão Mensal</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {MESES.map((mes) => (
              <div key={mes}>
                <label htmlFor={mes} className="block text-xs font-medium mb-1" style={{color: COLORS.textSecondary}}>{mes}</label>
                 <div className="relative">
                     <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sm" style={{color: COLORS.textSecondary}}>R$</span>
                     <input
                        type="text"
                        id={mes}
                        value={comissoes[mes]}
                        onChange={(e) => handleComissaoChange(mes, e.target.value)}
                        placeholder="0,00"
                        className="w-full pl-9 pr-2 py-2 rounded-lg transition text-sm"
                        style={{backgroundColor: '#2A2A2A', border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary}}
                      />
                  </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="ajudaDeCusto" className="block text-sm font-medium mb-1" style={{color: COLORS.textSecondary}}>Ajuda de Custo</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sm" style={{color: COLORS.textSecondary}}>R$</span>
            <input
              type="text"
              id="ajudaDeCusto"
              value={ajudaDeCusto}
              onChange={(e) => setAjudaDeCusto(formatCurrencyOnChange(e.target.value))}
              placeholder="0,00"
              className="w-full pl-9 pr-2 py-2 rounded-lg transition text-sm"
              style={{backgroundColor: '#2A2A2A', border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary}}
            />
          </div>
        </div>
      </div>

      {error && <p className="text-center mt-6 text-sm" style={{color: COLORS.error}}>{error}</p>}

      <div className="mt-8">
        <button
          onClick={handleCalculate}
          style={{ backgroundColor: COLORS.primary }}
          className="w-full text-white font-bold py-4 px-4 rounded-xl hover:opacity-90 transform hover:scale-[1.01] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-400/50"
        >
          {editingId ? 'SALVAR ALTERAÇÕES' : 'CALCULAR E SALVAR'}
        </button>
      </div>
    </div>
  );
  
  const CalculationStep = ({ title, steps, result, warning }) => (
    <div className="p-4 rounded-lg mb-4" style={{backgroundColor: '#2A2A2A'}}>
        <h4 className="font-bold" style={{color: COLORS.textPrimary}}>{title}</h4>
        {warning ? (
            <p className="text-sm mt-2" style={{color: COLORS.textSecondary}}>{warning}</p>
        ) : (
            <>
                <ul className="text-sm mt-2 space-y-1" style={{color: COLORS.textSecondary}}>
                    {steps.map((step, index) => <li key={index}>{step.label}: <span className="font-semibold" style={{color: COLORS.white}}>{step.value}</span></li>)}
                </ul>
                <p className="mt-3 font-bold text-base" style={{color: COLORS.success}}>➡ Resultado: {result}</p>
            </>
        )}
    </div>
  );

  const renderResultado = () => {
    const { comissoes, parcela1, parcela2, parcela3, totalGeral, nome, filial, ano: anoResultado } = resultado;

    return (
     <div className="p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-5xl mx-auto transition-all duration-300 animate-fade-in" style={{backgroundColor: COLORS.surface}}>
        <h2 className="text-2xl sm:text-3xl font-bold text-center" style={{ color: COLORS.textPrimary }}>Resultado do Cálculo</h2>
        <p className="text-center text-lg mb-8" style={{ color: COLORS.textSecondary }}>{nome} – {filial} ({anoResultado})</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Summary and Final Result */}
            <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>Resumo dos Valores Fornecidos</h3>
                <div className="max-h-64 overflow-y-auto rounded-lg" style={{border: `1px solid ${COLORS.border}`}}>
                    <table className="w-full text-sm">
                        <thead style={{backgroundColor: '#2A2A2A'}}>
                            <tr>
                                <th className="px-4 py-2 text-left font-medium" style={{color: COLORS.textSecondary}}>Mês</th>
                                <th className="px-4 py-2 text-right font-medium" style={{color: COLORS.textSecondary}}>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MESES.map(mes => (
                                <tr key={mes} className="border-t" style={{borderColor: COLORS.border}}>
                                    <td className="px-4 py-2" style={{color: COLORS.textPrimary}}>{mes}</td>
                                    <td className="px-4 py-2 text-right" style={{color: COLORS.textSecondary}}>{formatCurrency(comissoes[mes])}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 p-6 rounded-2xl" style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
                    <h3 className="text-xl font-bold mb-4 text-center">Resultado Final</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-baseline"><span className="opacity-80">Primeira Parcela:</span> <span className="font-bold text-lg">{formatCurrency(parcela1.valor)}</span></div>
                        <div className="flex justify-between items-baseline"><span className="opacity-80">Segunda Parcela:</span> <span className="font-bold text-lg">{formatCurrency(parcela2.valor)}</span></div>
                        <div className="flex justify-between items-baseline"><span className="opacity-80">Terceira Parcela:</span> <span className="font-bold text-lg">{formatCurrency(parcela3.valor)}</span></div>
                    </div>
                    <div className="border-t border-white/30 my-4"></div>
                    <div className="flex justify-between items-baseline text-2xl">
                        <span className="font-bold">Total Geral:</span>
                        <span className="font-bold">{formatCurrency(totalGeral)}</span>
                    </div>
                </div>
            </div>
            {/* Right Column: Detailed Calculation */}
            <div>
                 <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>Demonstração Detalhada dos Cálculos</h3>
                 <CalculationStep 
                    title="PRIMEIRA PARCELA (JAN–OUT)"
                    warning={!parcela1.calculado && "Aguardando valores de Janeiro a Outubro para calcular."}
                    steps={[
                        { label: 'Soma dos 10 meses', value: formatCurrency(parcela1.soma) },
                        { label: 'Média dos 10 meses', value: formatCurrency(parcela1.media) },
                        { label: 'Dividido por 2', value: formatCurrency(parcela1.valor) }
                    ]}
                    result={formatCurrency(parcela1.valor)}
                 />
                 <CalculationStep 
                    title="SEGUNDA PARCELA (JAN–NOV)"
                    warning={!parcela2.calculado && "A segunda parcela depende do valor de novembro. Cadastre para completar o cálculo."}
                    steps={[
                        { label: 'Soma dos 11 meses', value: formatCurrency(parcela2.soma) },
                        { label: 'Média dos 11 meses', value: formatCurrency(parcela2.media) },
                        { label: 'Dividido por 2', value: formatCurrency(parcela2.valor) }
                    ]}
                    result={formatCurrency(parcela2.valor)}
                 />
                 <CalculationStep 
                    title="TERCEIRA PARCELA (12 MESES)"
                    warning={!parcela3.calculado && "A terceira parcela depende do valor de dezembro. Cadastre para completar o cálculo final."}
                    steps={[
                        { label: 'Soma dos 12 meses', value: formatCurrency(parcela3.soma) },
                        { label: 'Cálculo 3 (total/12)', value: formatCurrency(parcela3.media) },
                        { label: 'Subtração das parcelas (1ª+2ª)', value: formatCurrency(parcela1.valor + parcela2.valor) },
                    ]}
                    result={formatCurrency(parcela3.valor)}
                 />
            </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
             <button
                onClick={handleNewCalculation}
                style={{ backgroundColor: COLORS.primary }}
                className="w-full text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-200"
            >
                NOVO CÁLCULO
            </button>
             <button
                onClick={handleGenerateRecibo}
                className="w-full font-bold py-3 px-4 rounded-xl transition-all duration-200"
                style={{backgroundColor: '#333333', color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`}}
            >
                GERAR RECIBO
            </button>
            <button
                onClick={handleExportPDF}
                className="w-full font-bold py-3 px-4 rounded-xl transition-all duration-200"
                style={{backgroundColor: '#333333', color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`}}
            >
                EXPORTAR RELATÓRIO
            </button>
        </div>
    </div>
    )
  };

  const filteredHistorico = useMemo(() => {
    return historico.filter(item => {
        const nomeMatch = item.resultado.nome.toLowerCase().includes(filtroNome.toLowerCase());
        const filialMatch = item.resultado.filial.toLowerCase().includes(filtroFilial.toLowerCase());
        const anoMatch = filtroAno === '' || item.resultado.ano === filtroAno;
        return nomeMatch && filialMatch && anoMatch;
    });
  }, [historico, filtroNome, filtroFilial, filtroAno]);

  const renderHistorico = () => (
    <div className="p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-5xl mx-auto transition-all duration-300 animate-fade-in" style={{backgroundColor: COLORS.surface}}>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" style={{ color: COLORS.textPrimary }}>Histórico de Cálculos</h2>
        
        {/* Search Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div>
              <label htmlFor="filtroNome" className="block text-sm font-medium mb-1" style={{color: COLORS.textSecondary}}>Buscar por Nome</label>
              <input
                type="text"
                id="filtroNome"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                placeholder="Digite o nome..."
                className="w-full px-4 py-3 rounded-lg transition"
                style={{backgroundColor: '#2A2A2A', border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary}}
              />
            </div>
            <div>
              <label htmlFor="filtroFilial" className="block text-sm font-medium mb-1" style={{color: COLORS.textSecondary}}>Buscar por Filial</label>
              <input
                type="text"
                id="filtroFilial"
                value={filtroFilial}
                onChange={(e) => setFiltroFilial(e.target.value)}
                placeholder="Digite a filial..."
                className="w-full px-4 py-3 rounded-lg transition"
                style={{backgroundColor: '#2A2A2A', border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary}}
              />
            </div>
            <div>
              <label htmlFor="filtroAno" className="block text-sm font-medium mb-1" style={{color: COLORS.textSecondary}}>Filtrar por Ano</label>
              <input
                type="number"
                id="filtroAno"
                value={filtroAno}
                onChange={(e) => setFiltroAno(e.target.value)}
                placeholder="Ex: 2024"
                className="w-full px-4 py-3 rounded-lg transition"
                style={{backgroundColor: '#2A2A2A', border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary}}
              />
            </div>
        </div>

        {/* History List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {filteredHistorico.length > 0 ? filteredHistorico.map(item => (
                <div key={item.id} className="p-4 rounded-lg flex flex-wrap justify-between items-center gap-4" style={{backgroundColor: '#2A2A2A', border: `1px solid ${COLORS.border}`}}>
                    <div className="flex-grow">
                        <p className="font-bold text-lg" style={{color: COLORS.textPrimary}}>{item.resultado.nome}</p>
                        <p className="text-sm" style={{color: COLORS.textSecondary}}>
                            {item.resultado.filial} – Ano: <span className="text-white font-semibold">{item.resultado.ano}</span> – Lançado em: {item.data}
                        </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                        <p className="font-bold text-lg mb-1" style={{color: COLORS.success}}>{formatCurrency(item.resultado.totalGeral)}</p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => handleLoadFromHistory(item)}
                                className="text-sm px-3 py-1 rounded transition-opacity hover:opacity-80"
                                style={{backgroundColor: COLORS.primary, color: COLORS.white}}
                            >
                                Carregar p/ Editar
                            </button>
                            <button 
                                onClick={() => handleDeleteFromHistory(item.id)}
                                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Excluir cálculo"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )) : (
                <p className="text-center py-8" style={{color: COLORS.textSecondary}}>Nenhum cálculo encontrado com os filtros atuais.</p>
            )}
        </div>
        {hasMore && (
            <div className="mt-6 text-center">
                <button 
                    onClick={() => fetchHistory(true)} 
                    disabled={loading}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? 'Carregando...' : 'Carregar Mais'}
                </button>
            </div>
        )}
    </div>
  );

  const renderRelatorios = () => {
    const totalGeralRelatorio = dadosRelatorio.reduce((sum, item) => sum + item.resultado.totalGeral, 0);

    return (
    <div className="p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-5xl mx-auto transition-all duration-300 animate-fade-in" style={{backgroundColor: COLORS.surface}}>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" style={{ color: COLORS.textPrimary }}>Relatórios</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 p-4 rounded-lg" style={{backgroundColor: '#2A2A2A'}}>
            <div className="sm:col-span-2">
              <label htmlFor="filtroFilialRelatorio" className="block text-sm font-medium mb-1" style={{color: COLORS.textSecondary}}>Filtrar por Filial</label>
              <select
                id="filtroFilialRelatorio"
                value={filtroFilialRelatorio}
                onChange={(e) => setFiltroFilialRelatorio(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition"
                style={{backgroundColor: '#333333', border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary}}
              >
                  <option value="todas">Todas as Filiais</option>
                  {filiaisDisponiveis.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="dataInicio" className="block text-sm font-medium mb-1" style={{color: COLORS.textSecondary}}>Data de Início</label>
              <input
                type="date"
                id="dataInicio"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition"
                style={{backgroundColor: '#333333', border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary}}
              />
            </div>
            <div>
              <label htmlFor="dataFim" className="block text-sm font-medium mb-1" style={{color: COLORS.textSecondary}}>Data Final</label>
              <input
                type="date"
                id="dataFim"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition"
                style={{backgroundColor: '#333333', border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary}}
              />
            </div>
        </div>
        
        <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={handleGerarRelatorio}
              style={{ backgroundColor: COLORS.primary }}
              className="text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all duration-200"
            >
              GERAR RELATÓRIO
            </button>
            <button
              onClick={handleExportarRelatorioPDF}
              className="font-bold py-3 px-8 rounded-xl transition-all duration-200"
              style={{backgroundColor: '#333333', color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`}}
              disabled={dadosRelatorio.length === 0}
            >
              EXPORTAR PDF
            </button>
        </div>

        {/* Results Table */}
        <div className="max-h-[50vh] overflow-y-auto rounded-lg" style={{border: `1px solid ${COLORS.border}`}}>
            <table className="w-full text-sm text-left">
                <thead className="sticky top-0" style={{backgroundColor: '#2A2A2A'}}>
                    <tr>
                        <th className="px-4 py-3 font-medium" style={{color: COLORS.textSecondary}}>Filial</th>
                        <th className="px-4 py-3 font-medium" style={{color: COLORS.textSecondary}}>Funcionária</th>
                        <th className="px-4 py-3 font-medium text-right" style={{color: COLORS.textSecondary}}>Total (Comissão)</th>
                    </tr>
                </thead>
                <tbody>
                    {dadosRelatorio.length > 0 ? dadosRelatorio.map(item => (
                        <tr key={item.id} className="border-t" style={{borderColor: COLORS.border}}>
                            <td className="px-4 py-3" style={{color: COLORS.textPrimary}}>{item.resultado.filial}</td>
                            <td className="px-4 py-3" style={{color: COLORS.textPrimary}}>{item.resultado.nome}</td>
                            <td className="px-4 py-3 text-right font-semibold" style={{color: COLORS.success}}>{formatCurrency(item.resultado.totalGeral)}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={3} className="text-center py-8" style={{color: COLORS.textSecondary}}>
                                Nenhum dado encontrado. Por favor, ajuste os filtros e gere um novo relatório.
                            </td>
                        </tr>
                    )}
                </tbody>
                {dadosRelatorio.length > 0 && (
                  <tfoot className="sticky bottom-0" style={{backgroundColor: '#2A2A2A'}}>
                      <tr className="border-t-2" style={{borderColor: COLORS.border}}>
                          <td colSpan={2} className="px-4 py-3 font-bold text-right text-base" style={{color: COLORS.textPrimary}}>TOTAL GERAL</td>
                          <td className="px-4 py-3 font-bold text-right text-base" style={{color: COLORS.success}}>{formatCurrency(totalGeralRelatorio)}</td>
                      </tr>
                  </tfoot>
                )}
            </table>
        </div>
    </div>
  )};

  return (
    <div className="min-h-screen">
      <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: '' })} 
      />
      <Header />
      <main className="p-4 sm:p-8 flex flex-col justify-center items-center">
        <h1 
          className="text-4xl sm:text-5xl font-bold text-center mb-8" 
          style={{ color: COLORS.primary, textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
        >
          BLUK ADMINISTRATIVO
        </h1>
        <div className="w-full max-w-5xl mb-6 flex justify-center border-b" style={{borderColor: COLORS.border}}>
            <button 
                onClick={() => { setViewMode('calculator'); setResultado(null); handleNewCalculation(); }}
                className={`py-3 px-6 font-bold transition-colors duration-200 ${viewMode === 'calculator' ? `border-b-2 text-white` : 'text-gray-500'}`}
                style={{borderColor: viewMode === 'calculator' ? COLORS.primary : 'transparent'}}
            >
                Calculadora
            </button>
            <button 
                onClick={() => setViewMode('history')}
                className={`py-3 px-6 font-bold transition-colors duration-200 ${viewMode === 'history' ? `border-b-2 text-white` : 'text-gray-500'}`}
                style={{borderColor: viewMode === 'history' ? COLORS.primary : 'transparent'}}
            >
                Histórico
            </button>
             <button 
                onClick={() => setViewMode('relatorios')}
                className={`py-3 px-6 font-bold transition-colors duration-200 ${viewMode === 'relatorios' ? `border-b-2 text-white` : 'text-gray-500'}`}
                style={{borderColor: viewMode === 'relatorios' ? COLORS.primary : 'transparent'}}
            >
                Relatórios
            </button>
        </div>

        {viewMode === 'calculator' && (resultado ? renderResultado() : renderFormulario())}
        {viewMode === 'history' && renderHistorico()}
        {viewMode === 'relatorios' && renderRelatorios()}

      </main>
      <footer className="text-center py-6 px-4">
        <p className="text-sm" style={{color: COLORS.textSecondary}}>&copy; {new Date().getFullYear()} Bluk. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);