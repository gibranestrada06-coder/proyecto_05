class ResiduoRPBI {
    constructor(area, tipo, peso) {
        this.id = Date.now();
        this.area = area;
        this.tipo = tipo;
        this.peso = parseFloat(peso);
    }
}

// Clave para LocalStorage
const STORAGE_KEY = 'manifiesto_rpbi';

// Referencias al DOM
const inputArea = document.getElementById('areaHosp');
const selectTipo = document.getElementById('tipoRPBI');
const inputPeso = document.getElementById('pesoKg');
const btnAgregar = document.getElementById('btnAgregarResiduo');
const listaResiduos = document.getElementById('listaResiduos');
const badgePunzo = document.getElementById('totPunzo');
const badgePato = document.getElementById('totPato');

// Inicializar datos desde LocalStorage
let residuos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// 2. Función principal para actualizar DOM, recorrer array y calcular totales
function actualizarInterfaz() {
    listaResiduos.innerHTML = '';
    
    let totalPunzocortantes = 0;
    let totalPatologicos = 0;

    // Recorrido del array obtenido de LocalStorage
    residuos.forEach((item) => {
        // Expresiones condicionales para acumular pesos de forma independiente
        if (item.tipo === 'punzocortante') {
            totalPunzocortantes += item.peso;
        } else if (item.tipo === 'patologico') {
            totalPatologicos += item.peso;
        }

        // Configuración visual dinámica según el tipo de residuo
        const esPunzo = item.tipo === 'punzocortante';
        const claseBadge = esPunzo ? 'bg-danger' : 'bg-warning text-dark';
        const etiquetaTipo = esPunzo ? 'Punzocortante' : 'Patológico';

        // Creación e inyección del elemento en la lista
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
                <strong class="d-block">${item.area}</strong>
                <span class="badge ${claseBadge}">${etiquetaTipo}</span>
            </div>
            <span class="fs-5 fw-bold text-secondary">${item.peso.toFixed(2)} kg</span>
        `;
        listaResiduos.appendChild(li);
    });

    // Reflejar los cálculos en las insignias/tarjetas de resumen
    badgePunzo.textContent = totalPunzocortantes.toFixed(2);
    badgePato.textContent = totalPatologicos.toFixed(2);
}

// 3. Evento para registrar nuevo desecho y actualizar en tiempo real
btnAgregar.addEventListener('click', () => {
    const area = inputArea.value.trim();
    const tipo = selectTipo.value;
    const peso = parseFloat(inputPeso.value);

    // Validación básica de entrada
    if (!area || isNaN(peso) || peso <= 0) {
        alert('Por favor, ingresa un área válida y un peso mayor a 0 kg.');
        return;
    }

    // Instanciar la clase y guardar en el arreglo
    const nuevoResiduo = new ResiduoRPBI(area, tipo, peso);
    residuos.push(nuevoResiduo);

    // Persistir en LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(residuos));

    // Limpiar formulario y enfocar
    inputArea.value = '';
    inputPeso.value = '';
    inputArea.focus();

    // Actualizar vista y totales inmediatamente
    actualizarInterfaz();
});

// Renderizado inicial al cargar la página
document.addEventListener('DOMContentLoaded', actualizarInterfaz);