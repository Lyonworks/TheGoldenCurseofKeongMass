AOS.init({
  duration: 1000,
  once: false,
  easing: 'ease-in-out',
  mirror: true 
});

document.querySelectorAll('.scroll-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

const merchandiseModal = document.getElementById('merchandiseModal');
const waBtn = document.getElementById('waBtn');

merchandiseModal.addEventListener('show.bs.modal', function (event) {
  const card = event.relatedTarget;

  const name = card.dataset.name;
  const price = card.dataset.price;
  const description = card.dataset.description;
  const image = card.dataset.image;
  const stock = parseInt(card.dataset.stock);

  document.getElementById('modalName').textContent = name;
  document.getElementById('modalPrice').textContent = price;
  document.getElementById('modalDescription').textContent = description;
  document.getElementById('modalStock').textContent = stock;
  document.getElementById('modalImage').src = image;

  const phone = "6285731590848";

  if (stock <= 0) {
    waBtn.textContent = '❌ SOLD OUT';
    waBtn.href = '#';
    waBtn.classList.add('disabled');
    waBtn.setAttribute('aria-disabled', 'true');
  } 
  else {
    const message = `Halo admin
    Saya ingin memesan merchandise:
    Produk : ${name}
    Harga : ${price}
    Apakah masih tersedia?`;

    waBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    waBtn.classList.remove('disabled');
    waBtn.removeAttribute('aria-disabled');
  }
});

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('reply-btn')) {
    const commentBox = e.target.closest('.comment-box');
    const replyForm  = commentBox.querySelector('.reply-form');
    replyForm.classList.toggle('d-none');
  }

  if (e.target.classList.contains('edit-btn')) {
    const wrapper = e.target.closest('.comment-box, .reply-box');

    wrapper.querySelector('.comment-text').classList.add('d-none');
    wrapper.querySelector('.edit-form').classList.remove('d-none');
  }

  if (e.target.classList.contains('cancel-edit')) {
    const wrapper = e.target.closest('.comment-box, .reply-box');

    wrapper.querySelector('.edit-form').classList.add('d-none');
    wrapper.querySelector('.comment-text').classList.remove('d-none');
  }
});