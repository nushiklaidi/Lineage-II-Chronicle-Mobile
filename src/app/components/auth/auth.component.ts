import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4 relative overflow-hidden select-none">
      <!-- Background Ambient Glow -->
      <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/30 via-slate-950 to-black"></div>

      <!-- Auth Card Container -->
      <div class="w-full max-w-md bg-[#12121a]/95 border-2 border-[#8b7355] rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative z-10 space-y-6">
        
        <!-- Header & Logo -->
        <div class="text-center space-y-2">
          <div class="inline-flex p-3 rounded-full bg-black/60 border border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <span class="text-3xl">🐉</span>
          </div>
          <h1 class="text-2xl font-serif font-bold text-[#d4af37] tracking-wider uppercase">Lineage II Chronicle</h1>
          <p class="text-xs text-slate-400 font-serif">Cloud Realm Authentication</p>
        </div>

        <!-- Mode Toggle Tabs (Sign In / Register) -->
        <div class="flex bg-[#0a0a0c] border border-[#3c3c4a] p-1 rounded-xl text-xs font-bold">
          <button 
            type="button"
            (click)="mode.set('login')"
            class="flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            [ngClass]="mode() === 'login' ? 'bg-[#8b7355] text-black font-bold border border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
            <span>🔑</span>
            <span>Sign In</span>
          </button>
          <button 
            type="button"
            (click)="mode.set('register')"
            class="flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            [ngClass]="mode() === 'register' ? 'bg-[#8b7355] text-black font-bold border border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
            <span>⚔️</span>
            <span>Register</span>
          </button>
        </div>

        <!-- Error Banner -->
        @if (auth.authError(); as errorMsg) {
          <div class="bg-red-950/90 border border-red-700 p-3 rounded-xl text-red-200 text-xs space-y-2 animate-shake">
            <div class="flex items-start gap-2">
              <span class="text-base">⚠️</span>
              <span class="flex-1">{{ errorMsg }}</span>
            </div>
            @if (errorMsg.includes('disabled') || errorMsg.includes('Console')) {
              <button 
                type="button"
                (click)="handleGuestLogin()"
                class="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow">
                <span>⚡</span>
                <span>Play as Guest Now</span>
              </button>
            }
          </div>
        }

        <!-- Auth Form -->
        <form (ngSubmit)="handleSubmit()" class="space-y-4">
          
          <!-- Email Input -->
          <div class="space-y-1">
            <label for="authEmailInput" class="text-[11px] font-mono text-[#8b7355] uppercase tracking-wider block">Email Address</label>
            <div class="relative">
              <input 
                id="authEmailInput"
                type="email" 
                [(ngModel)]="email" 
                name="email"
                required
                placeholder="hero@lineage2.com"
                class="w-full bg-[#0a0a0c] border border-[#3c3c4a] focus:border-[#d4af37] text-slate-200 text-xs px-3 py-2.5 rounded-xl outline-none transition-colors font-mono" />
            </div>
          </div>

          <!-- Password Input -->
          <div class="space-y-1">
            <label for="authPasswordInput" class="text-[11px] font-mono text-[#8b7355] uppercase tracking-wider block">Password</label>
            <div class="relative">
              <input 
                id="authPasswordInput"
                type="password" 
                [(ngModel)]="password" 
                name="password"
                required
                placeholder="••••••••"
                class="w-full bg-[#0a0a0c] border border-[#3c3c4a] focus:border-[#d4af37] text-slate-200 text-xs px-3 py-2.5 rounded-xl outline-none transition-colors font-mono" />
            </div>
          </div>

          <!-- Primary Submit Button -->
          <button 
            type="submit"
            [disabled]="isSubmitting() || !email() || !password()"
            class="w-full py-3 bg-gradient-to-r from-[#8b7355] via-[#d4af37] to-[#8b7355] text-black font-serif font-bold text-xs uppercase tracking-widest rounded-xl border border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            @if (isSubmitting()) {
              <span class="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              <span>Processing...</span>
            } @else {
              <span>{{ mode() === 'login' ? 'ENTER THE REALM' : 'CREATE ACCOUNT' }}</span>
            }
          </button>
        </form>

        <!-- Divider -->
        <div class="relative flex items-center justify-center my-2">
          <div class="border-t border-[#3c3c4a] w-full"></div>
          <span class="bg-[#12121a] px-3 text-[10px] text-slate-500 font-mono uppercase">OR</span>
        </div>

        <!-- Secondary Auth Buttons (Google & Guest) -->
        <div class="space-y-2">
          <!-- Google Sign In Button -->
          <button 
            type="button"
            (click)="handleGoogleLogin()"
            [disabled]="isSubmitting()"
            class="w-full py-2.5 bg-[#0a0a0c] border border-[#3c3c4a] hover:border-[#8b7355] text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95">
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <!-- Play as Guest Button -->
          <button 
            type="button"
            (click)="handleGuestLogin()"
            [disabled]="isSubmitting()"
            class="w-full py-2.5 bg-[#1a1a24] border border-[#3c3c4a] hover:border-[#d4af37] text-[#d4af37] text-xs font-serif font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95">
            <span>🛡️</span>
            <span>Play as Guest / Local Realm</span>
          </button>
        </div>

      </div>
    </div>
  `
})
export class AuthComponent {
  auth = inject(AuthService);

  mode = signal<'login' | 'register'>('login');
  email = signal<string>('');
  password = signal<string>('');
  isSubmitting = signal<boolean>(false);

  async handleSubmit() {
    if (!this.email() || !this.password()) return;

    this.isSubmitting.set(true);
    try {
      if (this.mode() === 'login') {
        await this.auth.loginWithEmail(this.email(), this.password());
      } else {
        await this.auth.registerWithEmail(this.email(), this.password());
      }
    } catch {
      // Error is handled in auth service via signal
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async handleGoogleLogin() {
    this.isSubmitting.set(true);
    try {
      await this.auth.loginWithGoogle();
    } catch {
      // Error handled in auth service
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async handleGuestLogin() {
    this.isSubmitting.set(true);
    try {
      await this.auth.loginAsGuest();
    } catch {
      // Handled in auth service
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
