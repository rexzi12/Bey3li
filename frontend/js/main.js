let products = [];
let cart = []; // مصفوفة لحفظ المنتجات المضافة إلى العربة

document.addEventListener('DOMContentLoaded', function () {
  const categoriesDropdown = document.getElementById('newCategoriesDropdown');
  const categoriesButton = document.getElementById('newCategoriesButton');
  const selectedCategory = document.getElementById('selectedCategory');



  // تحميل المنتجات
  fetch('../database/products.json')
    .then(response => response.json())
    .then(data => {
      products = data;
      renderProducts(products);
    })
    .catch(error => console.error('خطأ في تحميل المنتجات:', error));


  // تحميل الأصناف
  fetch('../database/categories.json')
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data.categories)) {
        // إضافة خيار "كل الأصناف"
        const allLi = document.createElement('li');
        allLi.innerHTML = `
          <a class="dropdown-item d-flex align-items-center gap-2" href="#" onclick="selectCategory('كل الأصناف')">
            <i class="bi bi-grid"></i> 
            <span>كل الأصناف</span>
          </a>`;
        categoriesDropdown.appendChild(allLi);

        // الأصناف الأخرى
        data.categories.forEach(category => {
          const li = document.createElement('li');
          li.innerHTML = `
            <a class="dropdown-item d-flex align-items-center gap-2" href="#" onclick="selectCategory('${category.name}')">
              <i class="${category.icon}"></i> 
              <span>${category.name}</span>
            </a>`;
          categoriesDropdown.appendChild(li);
        });
      }
    })
    .catch(error => console.error('خطأ في تحميل الأصناف:', error));

  // تفعيل زر القائمة المنسدلة للأصناف
  categoriesButton.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleDropdown(categoriesDropdown);

  });


  // إغلاق عند الضغط خارج القائمة
  window.addEventListener('click', function (e) {
    if (!categoriesButton.contains(e.target) && !categoriesDropdown.contains(e.target)) {
      closeDropdown(categoriesDropdown);
    }
  });
});

// دوال التحكم بالقائمة
function toggleDropdown(dropdown) {
  if (dropdown.style.display === 'none' || dropdown.style.display === '') {
    dropdown.classList.remove('fade-out');
    dropdown.classList.add('fade-in');
    dropdown.style.display = 'block';
  } else {
    dropdown.classList.remove('fade-in');
    dropdown.classList.add('fade-out');
    setTimeout(() => { dropdown.style.display = 'none'; }, 300);
  }
}

function closeDropdown(dropdown) {
  dropdown.classList.remove('fade-in');
  dropdown.classList.add('fade-out');
  setTimeout(() => { dropdown.style.display = 'none'; }, 300);
}

// تغيير اسم الزر وتصفية المنتجات
function selectCategory(categoryName) {
  const selectedCategory = document.getElementById('selectedCategory');
  selectedCategory.textContent = categoryName;

  if (categoryName === 'كل الأصناف') {
    renderProducts(products);
  } else {
    filterProducts(categoryName);
  }

  closeDropdown(document.getElementById('newCategoriesDropdown'));
}

// تصفية المنتجات حسب الصنف
function filterProducts(categoryName) {
  const filtered = products.filter(product => product.category === categoryName);
  renderProducts(filtered);
}

// عرض كل المنتجات
function renderProducts(productsList) {
  const container = document.getElementById('productsContainer');
  container.innerHTML = '';

  if (productsList.length === 0) {
    container.innerHTML = `<div class="col-12 text-center text-muted">لا توجد منتجات متاحة لهذا الصنف.</div>`;
    return;
  }

  productsList.forEach(product => {
    container.innerHTML += `
      <div class="col-md-3">
        <div class="card product-card shadow-sm">
          <img 
            src="${product.image}" 
            class="card-img-top" 
            alt="${product.name}" 
            style="cursor: pointer;" 
            onclick="redirectToProductDetails('${product.id}', '${product.name}', '${product.price}', '${product.image}', '${product.description}')"
          >
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text text-danger fw-bold">${product.price}</p>
            <button 
              class="btn btn-outline-primary w-100"
              onclick="showProductDetails('${product.id}')"
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      </div>
    `;
  });
}


// دالة لتحويل المستخدم إلى صفحة تفاصيل المنتج مع إرسال البيانات
function redirectToProductDetails(productId, productName, productPrice, productImage, productDescription) {
  // تخزين المنتج في localStorage قبل الانتقال إلى صفحة التفاصيل
  const productDetails = {
    id: productId,
    name: productName,
    price: productPrice,
    image: productImage,
    description: productDescription
  };

  localStorage.setItem('selectedProduct', JSON.stringify(productDetails));

  // الانتقال إلى صفحة التفاصيل
  window.location.href = 'product-details.html';
}




// تحميل المودال من ملف خارجي
function loadProductModal() {
  fetch('productModal.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
    })
    .catch(error => console.error('Error loading modal:', error));
}

// عرض تفاصيل المنتج في مودال
function showProductDetails(id) {
  const product = products.find(p => p.id == id);
  if (!product) return;

  document.getElementById('modalProductName').innerText = product.name;
  document.getElementById('modalProductPrice').innerText = product.price;
  document.getElementById('modalProductDescription').innerText = product.description;
  document.getElementById('modalProductImage').src = product.image;
  document.getElementById('modalProductQuantity').value = 1;

  // إضافة الحدث للزر "أضف إلى العربة"
  const addToCartButton = document.getElementById('addToCartButton');
  if (addToCartButton) {
    addToCartButton.onclick = function() {
      addToCart(product);
    };
  }

  const myModal = new bootstrap.Modal(document.getElementById('productModal'));
  myModal.show();
}


// زيادة الكمية
function increaseQuantity() {
  const qty = document.getElementById('modalProductQuantity');
  qty.value = parseInt(qty.value) + 1;
}

// نقصان الكمية
function decreaseQuantity() {
  const qty = document.getElementById('modalProductQuantity');
  if (parseInt(qty.value) > 1) {
    qty.value = parseInt(qty.value) - 1;
  }
}
// إضافة منتج إلى السلة وحفظها في localStorage
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingProduct = cart.find(item => item.id === parseInt(product.id)); // نبحث باستخدام id رقمي
  const quantity = parseInt(document.getElementById('modalProductQuantity').value);

  const price = parseFloat(product.price.replace(/[^0-9.-]+/g, ""));
  const imagePath = product.image;
  const productDescription = product.description || 'لا يوجد وصف للمنتج';

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({
      id: parseInt(product.id), // 👈 هنا نحول id إلى رقم
      name: product.name,
      price: price,
      image: imagePath,
      quantity: quantity,
      description: productDescription
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('تمت إضافة المنتج إلى العربة!');
  updateCartCount();
}



// دالة لتحديث رقم العربة بناءً على المحتوى في localStorage
function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  if (!cartCountElement) {
    console.error('لم يتم العثور على عنصر العربة');
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartCountElement.textContent = cart.length; // تحديث العداد لعدد المنتجات في السلة
}


// تحميل النافبار
fetch('navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar').innerHTML = data;

    updateCartCount(); // تبقي كما هي
    setupSearch(); // إعداد البحث بعد تحميل النافبار

    // استدعاء المودال بعد تحميل النافبار
    loadModal();
    loadLoginModal();
  });


// دالة لتحميل مودال تسجيل الدخول مع تفعيل زر تسجيل الدخول
function loadLoginModal() {
  fetch('login_modal.html')
    .then(response => response.text())
    .then(data => {
      const modalContainer = document.getElementById('modalloginContent');
      if (modalContainer) {
        modalContainer.innerHTML += data;

        // بعد إضافة المودال بنجاح، نفعل سكريبت تسجيل الدخول
        const loginForm = document.getElementById('loginForm');

        if (loginForm) {
          loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (!email || !password) {
              alert('يرجى ملء جميع الحقول');
              return;
            }

            // هنا تضيف كود الإرسال إلى الخادم مثلاً
            alert('تم تسجيل الدخول بنجاح!');
          });
        }
      }
    })
    .catch(error => {
      console.error('Error loading login modal:', error);
    });
}


function loadModal() {
  fetch('register_modal.html')
    .then(response => response.text())
    .then(data => {
      // تحديد مكان المودال
      const modalContainer = document.getElementById('modalContent');
      if (modalContainer) {
        modalContainer.innerHTML = data;

        // إضافة الأحداث للأزرار بعد تحميل المحتوى
        const chooseMarketerBtn = document.getElementById('chooseMarketer');
        const chooseMerchantBtn = document.getElementById('chooseMerchant');
        const backToStep1Btn = document.getElementById('backToStep1');

        // عند الضغط على زر "مسوق"
        if (chooseMarketerBtn) {
          chooseMarketerBtn.addEventListener('click', function () {
            document.getElementById('storeNameField').style.display = 'none';
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';
          });
        }

        // عند الضغط على زر "تاجر"
        if (chooseMerchantBtn) {
          chooseMerchantBtn.addEventListener('click', function () {
            document.getElementById('storeNameField').style.display = 'block';
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';
          });
        }

        // عند الضغط على زر "رجوع إلى الخطوة 1"
        if (backToStep1Btn) {
          backToStep1Btn.addEventListener('click', function () {
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step1').style.display = 'block';
          });
        }
      }
    })
    .catch(error => {
      console.error('Error loading the modal:', error);
    });
}

  

  // تحميل الفوتر
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    });
  
  // دالة لتحديث رقم العربة
  function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) {
      console.error('لم يتم العثور على cart-count');
      return;
    }
  
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    cartCountElement.textContent = cart.length;
  }
  
  // لما تكمل الصفحة تحميل بالكامل، حدث العداد (احتياط إضافي)
  window.addEventListener('load', () => {
    updateCartCount();
  });

  function setupSearch() {
    const searchInput = document.querySelector('input[type="search"]');
    
    if (!searchInput) {
      console.error('حقل البحث غير موجود');
      return;
    }
  
    // إنشاء صندوق للنتائج إن لم يكن موجود
    let resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) {
      resultsContainer = document.createElement('div');
      resultsContainer.id = 'search-results';
      resultsContainer.style.position = 'absolute';
      resultsContainer.style.backgroundColor = '#fff';
      resultsContainer.style.width = '100%';
      resultsContainer.style.zIndex = '1000';
      resultsContainer.style.border = '1px solid #ccc';
      resultsContainer.style.borderRadius = '5px';
      resultsContainer.style.maxHeight = '300px';
      resultsContainer.style.overflowY = 'auto';
      resultsContainer.style.top = '100%'; 
      resultsContainer.style.right = '0'; 
      resultsContainer.style.left = '0';
      resultsContainer.style.padding = '5px';
      resultsContainer.style.display = 'none'; 
      searchInput.parentElement.appendChild(resultsContainer);
    }
  
    searchInput.addEventListener('input', function() {
      const query = this.value.trim().toLowerCase();
      resultsContainer.innerHTML = '';
  
      if (query.length === 0) {
        resultsContainer.style.display = 'none';
        return;
      }
  
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query)
      );
  
      if (filteredProducts.length === 0) {
        resultsContainer.innerHTML = '<div class="p-2 text-muted">لا توجد منتجات مطابقة</div>';
      } else {
        filteredProducts.forEach(product => {
          const item = document.createElement('div');
          item.classList.add('d-flex', 'align-items-center', 'p-2', 'search-result-item');
          item.style.cursor = 'pointer';
          item.style.borderBottom = '1px solid #eee';
  
          item.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px; margin-left: 10px;">
            <div>
              <div class="fw-bold">${product.name}</div>
              <div class="text-muted" style="font-size: 0.8em;">${product.description.substring(0, 40)}...</div>
            </div>
          `;
  
          item.addEventListener('click', function() {
            redirectToProductDetails(product.id, product.name, product.price, product.image, product.description);
          });
  
          resultsContainer.appendChild(item);
        });
      }
  
      resultsContainer.style.display = 'block';
    });
  
    // إخفاء النتائج عند الضغط خارج البحث
    document.addEventListener('click', function(event) {
      if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
        resultsContainer.style.display = 'none';
      }
    });
  }
  

// تحميل المودال عند تحميل الصفحة
window.onload = loadProductModal;
