/* ==========================================================================
   Bhrigu Kripa Transport - Main Interactive JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Header scroll effect
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Nav Hamburger Toggle
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close menu when clicking nav link (especially on mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // 3. Active Nav Link on scroll (Scrollspy)
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset for sticky header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 4. Fleet Tabs switcher
    const fleetTabs = document.querySelectorAll('.fleet-tab-btn');
    const fleetPanes = document.querySelectorAll('.fleet-content-pane');

    fleetTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetFleet = tab.getAttribute('data-fleet');
            
            // Toggle tabs
            fleetTabs.forEach(btn => btn.classList.remove('active'));
            tab.classList.add('active');
            
            // Toggle content panes
            fleetPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `fleet-${targetFleet}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // 5. Booking Form Slider & Vehicle recommender
    const weightSlider = document.getElementById('cargoWeight');
    const weightDisplay = document.getElementById('weightDisplay');
    const vehicleField = document.getElementById('suggestedVehicle');

    const updateVehicleSuggestion = (weight) => {
        weightDisplay.textContent = `${weight} MT`;
        
        let suggestion = '';
        if (weight >= 4 && weight <= 10) {
            suggestion = 'Light Commercial (4 MT - 10 MT)';
        } else if (weight > 10 && weight <= 25) {
            suggestion = 'Medium & Heavy (10 MT - 25 MT)';
        } else {
            suggestion = 'Heavy Trailers & Special (25 MT - 100 MT)';
        }
        vehicleField.value = suggestion;
    };

    if (weightSlider) {
        weightSlider.addEventListener('input', (e) => {
            updateVehicleSuggestion(e.target.value);
        });
    }

    // Connect Fleet Section buttons directly to quote form
    const selectFleetButtons = document.querySelectorAll('.select-fleet-btn');
    selectFleetButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const weightVal = btn.getAttribute('data-weight');
            if (weightSlider) {
                weightSlider.value = weightVal;
                updateVehicleSuggestion(weightVal);
            }
            
            // Smoothly scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                // Highlight the form momentarily
                const formCard = document.querySelector('.contact-form-container');
                formCard.style.boxShadow = '0 0 25px rgba(255, 107, 0, 0.4)';
                setTimeout(() => {
                    formCard.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
                }, 1500);
            }
        });
    });

    // 6. Form Submission -> WhatsApp Link Builder
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop standard form reload
            
            const name = document.getElementById('clientName').value.trim();
            const phone = document.getElementById('clientPhone').value.trim();
            const source = document.getElementById('sourceCity').value.trim();
            const destination = document.getElementById('destCity').value.trim();
            const weight = weightSlider.value;
            const vehicle = vehicleField.value;
            const description = document.getElementById('cargoDescription').value.trim();
            
            // Validate required fields
            if (!name || !phone || !source || !destination) {
                alert('Please fill out all required fields.');
                return;
            }

            // Build WhatsApp message
            let waMessage = `*Bhrigu Kripa Transport - Quote Inquiry*\n\n`;
            waMessage += `*Client Name:* ${name}\n`;
            waMessage += `*Contact Phone:* ${phone}\n`;
            waMessage += `*Loading Location:* ${source}\n`;
            waMessage += `*Destination:* ${destination}\n`;
            waMessage += `*Weight:* ${weight} MT\n`;
            waMessage += `*Suggested Fleet:* ${vehicle}\n`;
            if (description) {
                waMessage += `*Details/Description:* ${description}\n`;
            }
            waMessage += `\n_Submitted via Bhrigu Kripa Transport website._`;

            // Encode message for URL
            const encodedMessage = encodeURIComponent(waMessage);
            const waNumber = '916205684301'; // Target number: +91 6205684301
            
            // Construct the final API URL
            const waURL = `https://wa.me/${waNumber}?text=${encodedMessage}`;
            
            // Open in new tab
            window.open(waURL, '_blank');
        });
    }

    // 7. Simple Fade-In Scroll Animation for Cards/Sections
    const revealElements = document.querySelectorAll('.service-card, .stat-box, .pillar-card, .zone-card');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => {
        // Set initial transition styles
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        revealObserver.observe(el);
    });
});
