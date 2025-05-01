// دالة لزيادة الكمية
function increaseQuantity() {
    const quantityInput = document.getElementById('modalProductQuantitySecondary');
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity += 1;
    quantityInput.value = currentQuantity;
    updateProductPriceOnly(); // تحديث السعر بناءً على الكمية الجديدة
  }
  
  // دالة لتقليص الكمية
  function decreaseQuantity() {
    const quantityInput = document.getElementById('modalProductQuantitySecondary');
    let currentQuantity = parseInt(quantityInput.value);
    if (currentQuantity > 1) {
      currentQuantity -= 1;
      quantityInput.value = currentQuantity;
      updateProductPriceOnly(); // تحديث السعر بناءً على الكمية الجديدة
    }
  }
  


  const product = JSON.parse(localStorage.getItem('selectedProduct'));

if (product) {
  // التأكد من وجود الصورة وعرض صورة افتراضية في حال لم تكن موجودة
  document.getElementById('productImage').src = product.image || 'images/placeholder.png';

  // عرض اسم المنتج مع قيمة افتراضية في حال غياب الاسم
  document.getElementById('productName').textContent = product.name || 'اسم المنتج غير متوفر';

  // عرض السعر مع قيمة افتراضية في حال غياب السعر
  document.getElementById('productPrice').textContent = product.price || 'لم يتم تحديد السعر';

  // عرض السعر القديم إذا كان موجودًا
  document.getElementById('oldPrice').textContent = product.oldPrice ? product.oldPrice : '';

  // عرض وصف المنتج إذا كان موجودًا
  document.getElementById('productDescription').textContent = product.description || 'لا توجد تفاصيل إضافية.';
} else {
  alert('لم يتم العثور على المنتج');
}


    const reviews = [
      {
        name: 'محمد علي',
        rating: 5,
        comment: 'منتج ممتاز جودة عالية وسعر مناسب!'
      },
      {
        name: 'سارة الأحمد',
        rating: 4,
        comment: 'أحببت المنتج ولكن تأخر التوصيل قليلاً.'
      },
      {
        name: 'أحمد يوسف',
        rating: 5,
        comment: 'رائع جدًا وأنصح به بشدة.'
      }
    ];

    const reviewsList = document.getElementById('reviewsList');

    reviews.forEach(review => {
      const stars = '<i class="bi bi-star-fill text-warning"></i>'.repeat(review.rating) + '<i class="bi bi-star text-muted"></i>'.repeat(5 - review.rating);
      const reviewItem = document.createElement('div');
      reviewItem.className = 'list-group-item';
      reviewItem.innerHTML = `
        <div class="d-flex justify-content-between">
          <h6 class="fw-bold mb-1">${review.name}</h6>
          <div>${stars}</div>
        </div>
        <p class="mb-0 text-muted">${review.comment}</p>
      `;
      reviewsList.appendChild(reviewItem);
    });

 // إضافة الحدث للزر "أضف إلى العربة"
 const addToCartButton = document.getElementById('addToCartButton');
  if (addToCartButton) {
    addToCartButton.onclick = function() {
      addToCart(product);
    };
  }