document.addEventListener('DOMContentLoaded', () => {
    // Event listener for toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const content = document.getElementById(targetId);
            const animationDelay = 100; // Default animation delay

            if (content.classList.contains('open')) {
                content.classList.remove('open');
                button.querySelector('span').textContent = 'expand_more';
            } else {
                content.classList.add('open');
                button.querySelector('span').textContent = 'expand_less';

                // Animate elements when expanded
                switch (targetId) {
                    case 'projects-content':
                        animateElements('.project', animationDelay);
                        break;
                    case 'graphics-content':
                        animateElements('.album.open', animationDelay);
                        break;
                    case 'about-content':
                        animateParagraphs(content.querySelectorAll('p'), 300);
                        break;
                    case 'skills-content':
                        animateProgressBars('.progress', 500);
                        break;
                    case 'experience-content':
                        animateElements('.job', 200);
                        break;
                    case 'education-content':
                        animateElements('.education-item', animationDelay);
                        break;
                    default:
                        break;
                }
            }
        });
    });

    // Smooth scroll to contact section
    document.querySelector('.contact-links a[href="#contact"]').addEventListener('click', event => {
        event.preventDefault();
        const contactSection = document.getElementById('contact');
        contactSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Initialize animations for default open sections
    initializeAnimations();
    initializeProgressBars();

    // Modal functionality for graphics section albums
    document.querySelectorAll('.album').forEach(album => {
        album.addEventListener('click', () => {
            const albumName = album.getAttribute('data-album');
            const images = album.querySelectorAll('.album-image');
            const modal = createModal(albumName, images);
            document.body.appendChild(modal);
        });
    });
});

function animateElements(selector, delay) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animated');
        }, index * delay);
    });
}

function animateParagraphs(paragraphs, delay) {
    paragraphs.forEach((p, index) => {
        setTimeout(() => {
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
        }, index * delay);
    });
}

function animateProgressBars(selector, delay) {
    document.querySelectorAll(selector).forEach(progressBar => {
        const width = parseFloat(progressBar.getAttribute('data-width')); 
        let currentWidth = 0;

        const increaseWidth = () => {
            if (currentWidth <= width) {
                progressBar.style.width = `${currentWidth}%`;
                progressBar.textContent = `${Math.floor(currentWidth)}%`;
                currentWidth++;
                setTimeout(increaseWidth, delay / width);
            }
        };

        increaseWidth();
    });
}

function initializeAnimations() {
    animateElements('.project p', 100);
    animateElements('.album', 100);
    animateElements('.skill', 100);
    animateElements('.job p', 200);
    animateElements('.education-item p', 100); // Initialize education animations
}

function createModal(albumName, images) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.innerHTML = `
        <button class="modal-close-btn">×</button>
        <span class="modal-prev material-icons">chevron_left</span>
        <span class="modal-next material-icons">chevron_right</span>
        <div class="modal-images">
            <img src="${images[0].src}" alt="${albumName} Image" class="modal-image">
        </div>
    `;
    modal.appendChild(modalContent);

    const closeButton = modal.querySelector('.modal-close-btn');
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    const prevButton = modal.querySelector('.modal-prev');
    const nextButton = modal.querySelector('.modal-next');
    const modalImageContainer = modal.querySelector('.modal-images');
    let currentIndex = 0;

    function showImage(index) {
        const currentImage = modalImageContainer.querySelector('.modal-image');
        const newImage = new Image();
        newImage.src = images[index].src;
        newImage.alt = `${albumName} Image ${index + 1}`;
        newImage.className = 'modal-image slide-in';
        newImage.style.opacity = 0;
        modalImageContainer.appendChild(newImage);

        setTimeout(() => {
            currentImage.classList.add('fade-out');
            newImage.style.opacity = 1;
            newImage.classList.remove('slide-in');
        }, 10);

        setTimeout(() => {
            currentImage.remove();
        }, 500); // Matches the duration of the transition
    }

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });

    // Close modal by clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextButton.click();
        if (e.key === 'ArrowLeft') prevButton.click();
        if (e.key === 'Escape') closeButton.click();
    });

    return modal;
}


function initializeProgressBars(selector, delay) {
    document.querySelectorAll(selector).forEach(progressBar => {
        const width = parseFloat(progressBar.getAttribute('data-width'));
        let currentWidth = parseFloat(progressBar.style.width) || 0;

        const increaseWidth = () => {
            if (currentWidth <= width) {
                progressBar.style.width = `${currentWidth}%`;
                progressBar.textContent = `${Math.floor(currentWidth)}%`;
                currentWidth++;
                setTimeout(increaseWidth, delay / width);
            }
        };

        if (progressBar.closest('.open')) {
            increaseWidth();
        } else {
            currentWidth = 0;
        }
    });
}

document.getElementById('screenshot-button').addEventListener('click', function() {
    const pdf = new jsPDF('p', 'mm', [210, 594]); // Two-page long format
    const pageWidth = 210;
    const margin = 15;
    const lineHeight = 7;
    let y = 20;

    function addSectionTitle(title) {
        pdf.setFontSize(16);
        pdf.setTextColor(0, 112, 192);
        pdf.setFont("Helvetica", "bold");
        pdf.text(title, margin, y);
        y += 10;
    }

    function addText(text, fontSize = 12, bold = false, color = [50, 50, 50], lineHeightMultiplier = 1) {
        pdf.setFontSize(fontSize);
        pdf.setTextColor(...color);
        if (bold) pdf.setFont("Helvetica", "bold");
        else pdf.setFont("Helvetica", "normal");
        const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
        pdf.text(lines, margin, y);
        y += lines.length * lineHeight * lineHeightMultiplier;
        if (bold) pdf.setFont("Helvetica", "normal");
    }

    function addDivider() {
        y += 5; // Reduced spacing before the divider
        pdf.setDrawColor(0, 112, 192);
        pdf.setLineWidth(0.8);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 10;
    }

    // Header with Name and Contact Information
    pdf.setFontSize(26);
    pdf.setTextColor(0, 112, 192);
    pdf.setFont("Helvetica", "bold");
    pdf.text('Jan Orestes Trinidad', margin, y);
    y += 12;
    
    addText('janorestestrinidad@gmail.com • GitHub: nateriver080320.github.io', 12);
    y += 10; // Adjust y after adding link
    addDivider();
    
    // Work Experience
    addSectionTitle('Work Experience');
    addText('Web Developer | Brain IT Consultancy', 12, true, [0, 112, 192]); // Highlighted job title
    addText('2018 - March 2024', 12, false, [0, 112, 192]); // Highlighted dates
    addText(`Developed secure web applications using HTML, CSS, and JavaScript. Specialized in front-end development and testing,
and worked with frameworks like Laravel and CakePHP, managing databases using phpMyAdmin with XAMPP.`, 12);
    
    addText('Freelance Graphic Artist | Self-Employed', 12, true, [0, 112, 192]); // Highlighted job title
    addText('Ongoing', 12, false, [0, 112, 192]); // Highlighted dates
    addText(`Created detailed and engaging visuals in Photoshop, and excelled in digital art and video editing using tools like Canva
and PowerDirector.`, 12);
    addDivider();

    // Education
    addSectionTitle('Education');
    addText('Isabela State University', 12, true, [0, 112, 192]); // Highlighted institution name
    addText('Certificate in Computer Hardware Servicing | 2015 - 2016', 12);
    y += 6;
    addText('University of La Salette High School', 12, true, [0, 112, 192]); // Highlighted institution name
    addText('High School Diploma | Graduated: 2007', 12);
    addDivider();

    // Skills
    addSectionTitle('Technologies And Languages'); 
    addText('Languages: HTML, CSS, JavaScript', 12);
    addText('Technologies: Git, Photoshop, PowerDirector, Canva', 12);
    addText('Frameworks: Laravel, CakePHP', 12);
    addDivider();

    // Projects
    addSectionTitle('Projects');
    addText('Web Application', 12, true, [0, 112, 192]); // Highlighted project name
    addText(`Developed a secure web application using modern front-end technologies and frameworks. Role: Implemented front-end features and
collaborated with team members to ensure project requirements were met.`, 12);
    
    addText('Data Visualization Tool', 12, true, [0, 112, 192]); // Highlighted project name
    addText(`Contributed to the development of a data visualization tool focusing on effective data representation. Role: Assisted in front-end development and
integration of data visualization components.`, 12);
    
    addText('Freelance Graphic Artist Projects', 12, true, [0, 112, 192]); // Highlighted project name
    addText(`Created engaging visuals and multimedia content for various clients. Key tools used: Adobe Photoshop, Canva, PowerDirector. Role: Developed digital art,
promotional materials, and video content based on client specifications.`, 12);
    
    addText('Web Application Project - PHP Management', 12, true, [0, 112, 192]); // Highlighted project name
    addText(`Utilized XAMPP for local server management and phpMyAdmin for database management in various web application projects.`, 12);
    addDivider();

    // Summary
    addSectionTitle('Summary');
    addText(`I am Jan Orestes Trinidad, a Multimedia Specialist with extensive experience in web development, video editing, and graphic artistry.
I worked at Brain IT Consultancy in Santiago City, Isabela, Philippines, from 2018 until the end of March 2024, serving as a Web Developer and Computer System Engineer. In this role, I specialized in testing, front-end development, CSS, and JavaScript. Additionally, I worked with frameworks like Laravel and CakePHP, and managed databases using phpMyAdmin with XAMPP.
Furthermore, I have a passion for creating impactful multimedia experiences through digital artistry in Photoshop, where I create detailed and engaging visuals. As a freelance graphic artist, I excel in digital art and video editing using tools like Canva and PowerDirector.`, 12, false, [50, 50, 50], 1.2);
    addDivider();

    // Interests
    addSectionTitle('Interests');
    addText('Content Creation, Drawing, Multimedia Art, Technology', 12);
    addDivider();

    // Contact Me
    addSectionTitle('Contact Info');
    addText('Email: janorestestrinidad@gmail.com', 12);
    addText('Phone: +1(929)687-7587', 12);
    addText('Address: Brooklyn, NY', 12);

    // Save the PDF
    pdf.save('Jan_Orestes_Trinidad_Resume.pdf');
});


document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const target = document.querySelector(item.getAttribute('data-target'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
