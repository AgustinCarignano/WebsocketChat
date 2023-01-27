const socket = io();

const form = document.getElementById("form");
const mensaje = document.getElementById("mensaje");
const historial = document.getElementById("historial");
let usuario = null;

socket.on("bienvenida", (msj) => {
  console.log(msj);
  Swal.fire({
    title: "Bienvenido",
    text: "Ingrese su nombre de usuario",
    input: "text",
    confirmButtonText: "Ingresar",
    allowOutsideClick: false,
    preConfirm: (usuario) => {
      if (!usuario) {
        Swal.showValidationMessage("Debe ingresar un nombre de ususario");
      }
    },
  }).then((obj) => {
    usuario = obj.value;
    socket.emit("nuevo ingreso", usuario);
  });
});

form.onsubmit = (e) => {
  e.preventDefault();
  const msj = mensaje.value;
  msj !== "" && socket.emit("mensaje", { user: usuario, message: msj });
  mensaje.value = "";
};

socket.on("mensaje", (arrayMsj) => {
  const listaMensajes = arrayMsj.map((el) => {
    const lista = `
        <p><strong>${el.user === usuario ? "Yo" : el.user}:</strong> ${
      el.message
    }</p>
        `;
    return lista;
  });
  historial.innerHTML = listaMensajes.join(" ");
});

socket.on("nuevo ingreso", (user) => {
  Toastify({
    text: `${user} se ha conectado`,
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    //onClick: function(){} // Callback after click
  }).showToast();
});
