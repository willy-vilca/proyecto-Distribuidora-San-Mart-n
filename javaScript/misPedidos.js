// Mostrar / ocultar detalles
document.querySelectorAll('.toggle-detalles').forEach(btn => {
    btn.addEventListener('click', () => {
    const detalles = btn.closest('.pedido-card').querySelector('.pedido-detalles');
    detalles.classList.toggle('mostrar');
    btn.innerHTML = detalles.classList.contains('mostrar')
        ? '<i class="bi bi-eye-slash"></i> Ocultar detalles'
        : '<i class="bi bi-eye"></i> Ver detalles';
    });
});