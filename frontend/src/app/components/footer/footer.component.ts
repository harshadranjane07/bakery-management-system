import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bakery-footer mt-auto pt-5 pb-3">
      <div class="container">
        <div class="row g-4 mb-4">
          <!-- Col 1: About Bakery -->
          <div class="col-lg-4 col-md-6">
            <div class="d-flex align-items-center mb-3">
              <div class="footer-icon me-2">
                <i class="bi bi-cake2-fill"></i>
              </div>
              <div>
                <h5 class="text-white mb-0 font-playfair">The Golden Crust</h5>
                <small class="text-warning text-uppercase" style="letter-spacing: 1px; font-size: 0.7rem;">Artisanal Bakery & Cafe</small>
              </div>
            </div>
            <p class="text-light-cream small">
              Handcrafting the finest cakes, pastries, breads, and cookies every morning.
              Made with pure butter, rich chocolate, and passion for authentic baking.
            </p>
            <div class="d-flex gap-2">
              <span class="social-icon"><i class="bi bi-instagram"></i></span>
              <span class="social-icon"><i class="bi bi-facebook"></i></span>
              <span class="social-icon"><i class="bi bi-whatsapp"></i></span>
            </div>
          </div>

          <!-- Col 2: Quick Links -->
          <div class="col-lg-2 col-md-6">
            <h6 class="text-warning text-uppercase mb-3 fw-bold" style="letter-spacing: 1px;">Quick Links</h6>
            <ul class="list-unstyled footer-links small">
              <li class="mb-2"><a routerLink="/"><i class="bi bi-chevron-right me-1 text-warning"></i> Home</a></li>
              <li class="mb-2"><a routerLink="/products"><i class="bi bi-chevron-right me-1 text-warning"></i> All Products</a></li>
              <li class="mb-2"><a routerLink="/cart"><i class="bi bi-chevron-right me-1 text-warning"></i> Shopping Cart</a></li>
              <li class="mb-2"><a routerLink="/login"><i class="bi bi-chevron-right me-1 text-warning"></i> Customer Login</a></li>
              <li class="mb-2"><a routerLink="/register"><i class="bi bi-chevron-right me-1 text-warning"></i> Register</a></li>
            </ul>
          </div>

          <!-- Col 3: Opening Hours -->
          <div class="col-lg-3 col-md-6">
            <h6 class="text-warning text-uppercase mb-3 fw-bold" style="letter-spacing: 1px;">Bakery Timings</h6>
            <ul class="list-unstyled text-light-cream small">
              <li class="mb-2 d-flex justify-content-between">
                <span>Monday - Friday:</span>
                <span class="text-white">8:00 AM - 10:00 PM</span>
              </li>
              <li class="mb-2 d-flex justify-content-between">
                <span>Saturday:</span>
                <span class="text-white">8:00 AM - 11:00 PM</span>
              </li>
              <li class="mb-2 d-flex justify-content-between">
                <span>Sunday:</span>
                <span class="text-warning">9:00 AM - 11:00 PM</span>
              </li>
              <li class="mt-3 text-muted" style="font-size: 0.75rem;">
                <i class="bi bi-truck me-1 text-warning"></i> Home Delivery within 45 mins!
              </li>
            </ul>
          </div>

          <!-- Col 4: Contact & Admin -->
          <div class="col-lg-3 col-md-6">
            <h6 class="text-warning text-uppercase mb-3 fw-bold" style="letter-spacing: 1px;">Contact Us</h6>
            <ul class="list-unstyled text-light-cream small">
              <li class="mb-2">
                <i class="bi bi-geo-alt-fill text-warning me-2"></i> 101 Baker Street, Market Road, Pune, MH
              </li>
              <li class="mb-2">
                <i class="bi bi-telephone-fill text-warning me-2"></i> +91 98765 43210
              </li>
              <li class="mb-2">
                <i class="bi bi-envelope-fill text-warning me-2"></i> orders&#64;thegoldencrust.com
              </li>
              <li class="mt-3">
                <a routerLink="/admin-login" class="btn btn-sm btn-outline-warning rounded-pill px-3 py-1">
                  <i class="bi bi-shield-lock me-1"></i> Admin Portal
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr class="border-secondary my-4" />

        <div class="row align-items-center small text-light-cream">
          <div class="col-md-6 text-center text-md-start mb-2 mb-md-0">
            &copy; 2026 The Golden Crust Bakery. All Rights Reserved.
          </div>
          <div class="col-md-6 text-center text-md-end">
            <span>
              <i class="bi bi-heart-fill text-danger me-1"></i> Freshly Baked Daily with Pure Ingredients & Love
            </span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .bakery-footer {
      background-color: #2E1B0E;
      color: #E2CEBE;
      border-top: 4px solid var(--soft-orange);
    }
    .text-light-cream {
      color: #D4BFAD;
    }
    .footer-icon {
      width: 32px;
      height: 32px;
      background: var(--soft-orange);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    .footer-links a {
      color: #D4BFAD;
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-links a:hover {
      color: var(--golden-crust);
      padding-left: 3px;
    }
    .social-icon {
      width: 32px;
      height: 32px;
      background: rgba(255,255,255,0.08);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #FAF3EB;
      cursor: pointer;
      transition: background 0.2s;
    }
    .social-icon:hover {
      background: var(--soft-orange);
    }
    .font-playfair {
      font-family: 'Playfair Display', serif;
    }
  `]
})
export class FooterComponent {}
