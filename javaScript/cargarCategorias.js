/*obteniendo las categorías a través del backend*/
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'http://localhost:8080/api';
  const menu = document.querySelector('.menuProductos');

  if (!menu) {
    console.warn('No se encontró el elemento .menuProductos en la página.');
    return;
  }

  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText} => ${url}`);
    }
    return res.json();
  }

  async function loadMenu() {
    try {
      // obtener categorías y subcategorias
      const categorias = await fetchJson(`${API_BASE}/categorias`);
      const subPromises = categorias.map(cat =>
        fetch(`${API_BASE}/categorias/${cat.id}/subcategorias`)
          .then(r => r.ok ? r.json() : [])
          .catch(() => [])
      );
      const allSubcats = await Promise.all(subPromises);

      menu.innerHTML = '';

      categorias.forEach((cat, idx) => {
        const subs = allSubcats[idx] || [];
        //armado de la estructura del menú
        const li = document.createElement('li');
        li.className = 'dropend';

        const aCat = document.createElement('a');
        aCat.className = 'dropdown-item dropdown-toggle py-2 categoria fw-bold';
        aCat.href = '#';
        const catId = `dropdownMenuCat${cat.id}`;
        aCat.id = catId;
        aCat.setAttribute('data-bs-toggle', 'dropdown');
        aCat.setAttribute('data-bs-auto-close', 'false');
        aCat.setAttribute('aria-expanded', 'false');
        aCat.textContent = cat.nombre;
        li.appendChild(aCat);

        const ulSub = document.createElement('ul');
        ulSub.className = 'dropdown-menu';
        ulSub.setAttribute('aria-labelledby', catId);

        if (subs.length === 0) {
          const liSub = document.createElement('li');
          const aSub = document.createElement('a');
          aSub.className = 'dropdown-item subcategoria';
          aSub.href = `productos.html?categoriaId=${cat.id}`;
          aSub.textContent = 'Ver productos';
          liSub.appendChild(aSub);
          ulSub.appendChild(liSub);
        } else {
          subs.forEach((s, sIdx) => {
            const liSub = document.createElement('li');
            const aSub = document.createElement('a');
            aSub.className = 'dropdown-item subcategoria';
            aSub.href = `productos.html?subcategoriaId=${s.id}`;
            aSub.textContent = s.nombre;
            liSub.appendChild(aSub);
            ulSub.appendChild(liSub);

            if (sIdx !== subs.length - 1) {
              const divider = document.createElement('li');
              divider.innerHTML = '<hr class="dropdown-divider">';
              ulSub.appendChild(divider);
            }
          });
        }

        li.appendChild(ulSub);
        menu.appendChild(li);

        if (idx !== categorias.length - 1) {
          const catDivider = document.createElement('li');
          catDivider.innerHTML = '<hr class="dropdown-divider">';
          menu.appendChild(catDivider);
        }
      });

      funcionalidadSubmenu();

    } catch (err) {
      console.error('Error cargando menú de categorías:', err);
    }
  }

  // configurando funcionalidad del menú
  function funcionalidadSubmenu(){
    document.querySelectorAll('.dropdown-menu [data-bs-toggle="dropdown"]').forEach(function(element) {
    element.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
  }

  // Carga inicial del menú
  loadMenu();
});
