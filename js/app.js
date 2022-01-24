const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
	moneda: '',
	criptomoneda: '',
};

// Crear un promise
const obtenerCriptomonedas = (criptomonedas) =>
	new Promise((resolve) => {
		resolve(criptomonedas);
	});

document.addEventListener('DOMContentLoaded', () => {
	consultarCriptomonedas();

	formulario.addEventListener('submit', validarForm);
	criptomonedasSelect.addEventListener('change', leerValor);
	monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas() {
	const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=15&tsym=USD';

	fetch(url)
		.then((resp) => resp.json())
		.then((resultado) => obtenerCriptomonedas(resultado.Data))
		.then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas) {
	criptomonedas.forEach((cripto) => {
		const { FullName, Name } = cripto.CoinInfo;

		const option = document.createElement('option');
		option.value = Name;
		option.textContent = FullName;

		criptomonedasSelect.appendChild(option);
	});
}

function leerValor(e) {
	// console.log(objBusqueda);
	objBusqueda[e.target.name] = e.target.value;
}

function validarForm(e) {
	e.preventDefault();

	const { moneda, criptomoneda } = objBusqueda;

	if (moneda === '' || criptomoneda === '') {
		alerta('Ambos campos son obligatorios');
		return;
	}

	// consultar la api con los resultados
	consultarAPI();
}

function alerta(mensaje) {
	const existeError = document.querySelector('.error');

	if (!existeError) {
		const alertaDiv = document.createElement('div');
		alertaDiv.classList.add('error');
		alertaDiv.textContent = mensaje;

		formulario.appendChild(alertaDiv);

		setTimeout(() => {
			alertaDiv.remove();
		}, 3000);
	}
}

function consultarAPI() {
	const { moneda, criptomoneda } = objBusqueda;
	const urlAPI = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

	// mostrar el spinner
	spinner();

	fetch(urlAPI)
		.then((resp) => resp.json())
		.then((resultado) => {
			// console.log(resultado.DISPLAY[criptomoneda][moneda]);
			mostrarCotizacion(resultado.DISPLAY[criptomoneda][moneda]);
		});
}

function mostrarCotizacion(cotizacion) {
	limpiarHTML();
	// console.log(cotizacion);
	const { PRICE, CHANGEPCTHOUR, LOWDAY, HIGHDAY, LASTUPDATE } = cotizacion;
	const precio = document.createElement('p');
	precio.classList.add('precio');
	precio.innerHTML = `
    El precio es de: <span>${PRICE}</span>
    `;

	const precioAlto = document.createElement('p');
	precioAlto.innerHTML = `
        <p>El precio más alto del día: <span>${HIGHDAY}</span></p>
    `;

	const precioBajo = document.createElement('p');
	precioBajo.innerHTML = `
        <p> El precio más bajo del día: <span>${LOWDAY}</span></p>
    `;

	const ultimasHrs = document.createElement('p');
	ultimasHrs.innerHTML = `
        <p>Variación en las ultimas 24 Horas: <span>${CHANGEPCTHOUR}%</span></p>
    `;

	const actualizacion = document.createElement('p');
	actualizacion.innerHTML = `
        <p>Actualización: <span>${LASTUPDATE}</span></p>
    `;

	resultado.appendChild(precio);
	resultado.appendChild(precioAlto);
	resultado.appendChild(precioBajo);
	resultado.appendChild(ultimasHrs);
	resultado.appendChild(actualizacion);
}

function spinner() {
	limpiarHTML();

	const spinner = document.createElement('div');
	spinner.classList.add('spinner');

	spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

	resultado.appendChild(spinner);
}

function limpiarHTML() {
	while (resultado.firstChild) {
		resultado.removeChild(resultado.firstChild);
	}
}
