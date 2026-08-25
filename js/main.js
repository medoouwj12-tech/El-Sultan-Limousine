/**
 * El-Sultan Limousine - Main Interactive JavaScript & Bilingual i18n
 * مكتب السلطان لخدمات الليموزين والزفاف ورجال الأعمال
 */

let currentLang = localStorage.getItem('sultan_lang') || 'ar';

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initFleetFilter();
  initBookingEngine();
  initLightbox();
  initPhoneCopy();
  initMobileMenu();
  initFAQAccordion();
  initCounterStats();
  
  // Apply saved language
  setLanguage(currentLang);
});

// ================= 1. BILINGUAL TRANSLATION SYSTEM ================= //
function initLanguageSwitcher() {
  const langBtns = document.querySelectorAll('.lang-switch-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = currentLang === 'ar' ? 'en' : 'ar';
      setLanguage(newLang);
    });
  });
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('sultan_lang', lang);

  const isRTL = lang === 'ar';
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);

  // Update Language Button Text
  const langLabels = document.querySelectorAll('.lang-btn-text');
  langLabels.forEach(el => {
    el.textContent = lang === 'ar' ? 'English (EN)' : 'العربية (AR)';
  });

  const t = translations[lang];

  // Update elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });

  // Update elements with data-i18n-html
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key]) {
      el.innerHTML = t[key];
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) {
      el.setAttribute('placeholder', t[key]);
    }
  });

  // Re-run fleet count & message generation
  updateFleetCounterText();
  if (window.generateWhatsAppMessage) {
    window.generateWhatsAppMessage();
  }
}

function updateFleetCounterText() {
  const countBadge = document.getElementById('visible-fleet-count');
  if (!countBadge) return;
  const activeTab = document.querySelector('.filter-tab.active');
  const filterVal = activeTab ? activeTab.getAttribute('data-filter') : 'all';
  
  let visible = 0;
  document.querySelectorAll('.vehicle-card').forEach(card => {
    const categories = card.getAttribute('data-category').split(' ');
    if (filterVal === 'all' || categories.includes(filterVal)) {
      visible++;
    }
  });

  if (currentLang === 'ar') {
    countBadge.textContent = `${visible} سيارة متوفرة وجاهزة`;
  } else {
    countBadge.textContent = `${visible} Vehicles Available & Ready`;
  }
}

// ================= 2. FLEET FILTERING SYSTEM ================= //
function initFleetFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const vehicleCards = document.querySelectorAll('.vehicle-card');

  if (!filterTabs.length || !vehicleCards.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      vehicleCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });

      updateFleetCounterText();
    });
  });
}

// ================= 3. SMART WHATSAPP BOOKING ENGINE ================= //
function initBookingEngine() {
  const form = document.getElementById('sultan-booking-form');
  const previewBox = document.getElementById('whatsapp-preview-text');
  const sendBtnMain = document.getElementById('btn-send-whatsapp-main');
  const sendBtnAlt = document.getElementById('btn-send-whatsapp-alt');

  const nameInput = document.getElementById('booking-name');
  const phoneInput = document.getElementById('booking-phone');
  const serviceInput = document.getElementById('booking-service');
  const vehicleInput = document.getElementById('booking-vehicle');
  const dateInput = document.getElementById('booking-date');
  const timeInput = document.getElementById('booking-time');
  const pickupInput = document.getElementById('booking-pickup');
  const dropoffInput = document.getElementById('booking-dropoff');
  const notesInput = document.getElementById('booking-notes');

  const mainPhone = '201284600065';
  const altPhone = '201551515830';

  window.generateWhatsAppMessage = function() {
    const name = nameInput?.value.trim() || (currentLang === 'ar' ? 'عميل محترم' : 'Valued Client');
    const phone = phoneInput?.value.trim() || (currentLang === 'ar' ? 'غير محدد' : 'Not specified');
    const service = serviceInput?.options[serviceInput.selectedIndex]?.text || (currentLang === 'ar' ? 'خدمة ليموزين' : 'Limousine Service');
    const vehicle = vehicleInput?.options[vehicleInput.selectedIndex]?.text || (currentLang === 'ar' ? 'سيارة حسب الاختيار' : 'Selected Vehicle');
    const date = dateInput?.value || (currentLang === 'ar' ? 'في أقرب وقت' : 'As soon as possible');
    const time = timeInput?.value || (currentLang === 'ar' ? 'غير محدد' : 'Not specified');
    const pickup = pickupInput?.value.trim() || (currentLang === 'ar' ? 'غير محدد' : 'Not specified');
    const dropoff = dropoffInput?.value.trim() || (currentLang === 'ar' ? 'غير محدد' : 'Not specified');
    const notes = notesInput?.value.trim() || (currentLang === 'ar' ? 'لا توجد ملاحظات إضافية' : 'No extra notes');

    let text = '';
    if (currentLang === 'ar') {
      text = `👑 *طلب حجز ليموزين - مكتب السلطان* 👑
━━━━━━━━━━━━━━━━━━━━
👤 *الاسم:* ${name}
📞 *رقم الهاتف:* ${phone}
💎 *نوع الخدمة:* ${service}
🚗 *السيارة المطلوبة:* ${vehicle}
📅 *تاريخ المشوار:* ${date}
⏰ *الوقت المطلوب:* ${time}
📍 *مكان الانطلاق:* ${pickup}
🏁 *مكان الوصول:* ${dropoff}
📝 *ملاحظات إضافية:* ${notes}
━━━━━━━━━━━━━━━━━━━━
✨ _تم إرسال الطلب عبر الموقع الإلكتروني لمكتب السلطان_ ✨`;
    } else {
      text = `👑 *VIP Limousine Booking Request - El-Sultan* 👑
━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${name}
📞 *Phone / WhatsApp:* ${phone}
💎 *Service Type:* ${service}
🚗 *Selected Vehicle:* ${vehicle}
📅 *Trip Date:* ${date}
⏰ *Requested Time:* ${time}
📍 *Pickup Location:* ${pickup}
🏁 *Destination:* ${dropoff}
📝 *Additional Notes:* ${notes}
━━━━━━━━━━━━━━━━━━━━
✨ _Sent via El-Sultan Limousine Official Website_ ✨`;
    }

    if (previewBox) {
      previewBox.textContent = text;
    }
    return text;
  };

  const inputs = [nameInput, phoneInput, serviceInput, vehicleInput, dateInput, timeInput, pickupInput, dropoffInput, notesInput];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', window.generateWhatsAppMessage);
      input.addEventListener('change', window.generateWhatsAppMessage);
    }
  });

  window.generateWhatsAppMessage();

  function openWhatsApp(targetNumber) {
    const message = window.generateWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${targetNumber}?text=${encoded}`;
    window.open(url, '_blank');
  }

  if (sendBtnMain) {
    sendBtnMain.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsApp(mainPhone);
    });
  }

  if (sendBtnAlt) {
    sendBtnAlt.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsApp(altPhone);
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      openWhatsApp(mainPhone);
    });
  }
}

// ================= 4. QUICK CAR BOOKING ================= //
window.selectCarForBooking = function(carValue, serviceType) {
  const vehicleSelect = document.getElementById('booking-vehicle');
  const serviceSelect = document.getElementById('booking-service');
  const bookingSection = document.getElementById('booking-section');

  if (vehicleSelect && carValue) {
    for (let i = 0; i < vehicleSelect.options.length; i++) {
      if (vehicleSelect.options[i].value.includes(carValue) || carValue.includes(vehicleSelect.options[i].value)) {
        vehicleSelect.selectedIndex = i;
        break;
      }
    }
    vehicleSelect.dispatchEvent(new Event('change'));
  }

  if (serviceSelect && serviceType) {
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].value.includes(serviceType) || serviceType.includes(serviceSelect.options[i].value)) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
    serviceSelect.dispatchEvent(new Event('change'));
  }

  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: 'smooth' });
    bookingSection.classList.add('glow-gold-pulse');
    setTimeout(() => {
      bookingSection.classList.remove('glow-gold-pulse');
    }, 2500);
  }

  const toastMsg = currentLang === 'ar' 
    ? `تم اختيار "${carValue}" ونقلك لنموذج الحجز بنجاح!`
    : `Selected "${carValue}" & moved to booking form!`;
  showToast(toastMsg);
};

// ================= 5. LIGHTBOX MODAL ================= //
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('lightbox-close');
  const bookBtn = document.getElementById('lightbox-book-btn');

  if (!modal) return;

  window.openLightbox = function(imageSrc, title, desc, carValue) {
    if (modalImg) modalImg.src = imageSrc;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;
    
    if (bookBtn && carValue) {
      bookBtn.onclick = () => {
        closeLightbox();
        window.selectCarForBooking(carValue);
      };
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// ================= 6. PHONE COPY & TOAST ================= //
function initPhoneCopy() {
  window.copyToClipboard = function(text, label = 'رقم الهاتف') {
    navigator.clipboard.writeText(text).then(() => {
      const msg = currentLang === 'ar'
        ? `تم نسخ ${label}: ${text} بنجاح! 📋`
        : `Copied ${label}: ${text} successfully! 📋`;
      showToast(msg);
    }).catch(() => {
      showToast(`${label}: ${text}`);
    });
  };
}

window.showToast = function(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    document.body.appendChild(toast);
  }

  const brand = currentLang === 'ar' ? '👑 مكتب السلطان:' : '👑 El-Sultan:';
  toast.innerHTML = `
    <span class="text-gold-gradient font-bold">${brand}</span>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
};

// ================= 7. MOBILE MENU ================= //
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// ================= 8. FAQ ACCORDION ================= //
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isOpen = !answer.classList.contains('hidden');
        
        document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
        document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

        if (!isOpen) {
          answer.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });
}

// ================= 9. COUNTER STATS ================= //
function initCounterStats() {
  const counters = document.querySelectorAll('.counter-stat');
  let animated = false;

  function countUp() {
    const section = document.getElementById('stats-section');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight && !animated) {
      animated = true;
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 30);
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            counter.textContent = target.toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US') + '+';
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current).toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
          }
        }, 30);
      });
    }
  }

  window.addEventListener('scroll', countUp);
  countUp();
}
