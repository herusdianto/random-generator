/**
 * Random Generator - Generate Random Strings, UUID, Password & More
 * 100% Client-side processing
 */

class RandomGenerator {
    constructor() {
        this.charsets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            hex: '0123456789ABCDEF'
        };
        this.init();
    }

    init() {
        this.restoreFromLocalStorage();
        this.bindGeneratorTypeToggle();
        this.bindInputChanges();
        this.bindCopyButtons();
        this.bindDownloadButtons();
        this.bindRegenerateButton();
        this.initThemeToggle();
        this.updateUIForType(this.getSavedType() || 'alpha');
        // Auto generate on load
        this.generate();
    }

    // ==================== Local Storage Save/Restore ====================
    saveToLocalStorage() {
        const type = document.querySelector('input[name="generator-type"]:checked')?.value;
        const length = document.getElementById('string-length')?.value;
        const quantity = document.getElementById('quantity')?.value;
        const separator = document.getElementById('separator')?.value;
        const customChars = document.getElementById('custom-chars')?.value;
        const checkboxes = ['include-uppercase', 'include-lowercase', 'include-numbers', 'include-symbols'];
        const checkboxStates = {};
        checkboxes.forEach(id => {
            const el = document.getElementById(id);
            if (el) checkboxStates[id] = el.checked;
        });
        const output = document.getElementById('output-text')?.value;
        const data = {
            type, length, quantity, separator, customChars, checkboxStates, output
        };
        localStorage.setItem('randomGenData', JSON.stringify(data));
    }

    restoreFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('randomGenData') || '{}');
        if (!data) return;
        if (data.type) {
            const radio = document.querySelector(`input[name="generator-type"][value="${data.type}"]`);
            if (radio) radio.checked = true;
        }
        if (data.length) document.getElementById('string-length').value = data.length;
        if (data.quantity) document.getElementById('quantity').value = data.quantity;
        if (data.separator) document.getElementById('separator').value = data.separator;
        if (data.customChars !== undefined) document.getElementById('custom-chars').value = data.customChars;
        if (data.checkboxStates) {
            Object.entries(data.checkboxStates).forEach(([id, checked]) => {
                const el = document.getElementById(id);
                if (el) el.checked = checked;
            });
        }
        if (data.output) document.getElementById('output-text').value = data.output;
    }

    getSavedType() {
        const data = JSON.parse(localStorage.getItem('randomGenData') || '{}');
        return data.type;
    }

    // ==================== Theme Toggle ====================
    initThemeToggle() {
        const themeSwitch = document.getElementById('theme-switch');
        const themeIcon = document.getElementById('theme-icon');

        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        this.updateThemeIcon(themeIcon, savedTheme);

        themeSwitch.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            const newTheme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(themeIcon, newTheme);
        });
    }

    updateThemeIcon(iconElement, theme) {
        iconElement.innerHTML = theme === 'dark'
            ? `<svg class="sun-icon" viewBox="0 0 24 24" width="28" height="28"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 13h2a1 1 0 100-2H2a1 1 0 100 2zm18 0h2a1 1 0 100-2h-2a1 1 0 100 2zM11 2v2a1 1 0 102 0V2a1 1 0 10-2 0zm0 18v2a1 1 0 102 0v-2a1 1 0 10-2 0zM5.99 4.58a1 1 0 10-1.41 1.41l1.06 1.06a1 1 0 101.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 10-1.41 1.41l1.06 1.06a1 1 0 101.41-1.41l-1.06-1.06zm1.06-10.96a1 1 0 10-1.41-1.41l-1.06 1.06a1 1 0 101.41 1.41l1.06-1.06zM7.05 18.36a1 1 0 10-1.41-1.41l-1.06 1.06a1 1 0 101.41 1.41l1.06-1.06z"></path></svg>`
            : `<svg class="moon-icon" viewBox="0 0 24 24" width="28" height="28"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"></path></svg>`;
    }

    // ==================== Generator Type Toggle ====================
    bindGeneratorTypeToggle() {
        const typeRadios = document.querySelectorAll('input[name="generator-type"]');
        typeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateUIForType(radio.value);
                this.generate();
                this.saveToLocalStorage();
            });
        });
    }

    // ==================== Bind Input Changes ====================
    bindInputChanges() {
        // Length input
        const lengthInput = document.getElementById('string-length');
        lengthInput.addEventListener('input', () => { this.generate(); this.saveToLocalStorage(); });

        // Quantity input
        const quantityInput = document.getElementById('quantity');
        quantityInput.addEventListener('input', () => { this.generate(); this.saveToLocalStorage(); });

        // Custom chars input
        const customCharsInput = document.getElementById('custom-chars');
        customCharsInput.addEventListener('input', () => { this.generate(); this.saveToLocalStorage(); });

        // Separator select
        const separatorSelect = document.getElementById('separator');
        separatorSelect.addEventListener('change', () => { this.generate(); this.saveToLocalStorage(); });

        // Checkboxes
        const checkboxes = ['include-uppercase', 'include-lowercase', 'include-numbers', 'include-symbols'];
        checkboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            checkbox.addEventListener('change', () => { this.generate(); this.saveToLocalStorage(); });
        });
    }

    updateUIForType(type) {
        const lengthSetting = document.getElementById('length-setting');
        const charOptions = document.getElementById('char-options');
        const customCharsSection = document.getElementById('custom-chars-section');

        // Show/hide length setting (UUID doesn't need it)
        lengthSetting.classList.toggle('hidden', type === 'uuid');

        // Show/hide character options based on type
        if (type === 'alpha') {
            charOptions.classList.remove('hidden');
            customCharsSection.classList.add('hidden');
            this.setCheckboxes(true, true, false, false);
        } else if (type === 'numeric') {
            charOptions.classList.add('hidden');
            customCharsSection.classList.add('hidden');
        } else if (type === 'alphanumeric') {
            charOptions.classList.remove('hidden');
            customCharsSection.classList.add('hidden');
            this.setCheckboxes(true, true, true, false);
        } else if (type === 'special') {
            charOptions.classList.remove('hidden');
            customCharsSection.classList.add('hidden');
            this.setCheckboxes(true, true, true, true);
        } else if (type === 'password') {
            charOptions.classList.remove('hidden');
            customCharsSection.classList.add('hidden');
            this.setCheckboxes(true, true, true, true);
        } else if (type === 'uuid') {
            charOptions.classList.add('hidden');
            customCharsSection.classList.add('hidden');
        } else if (type === 'hex') {
            charOptions.classList.add('hidden');
            customCharsSection.classList.add('hidden');
        } else if (type === 'custom') {
            charOptions.classList.add('hidden');
            customCharsSection.classList.remove('hidden');
        }
    }

    setCheckboxes(upper, lower, nums, syms) {
        document.getElementById('include-uppercase').checked = upper;
        document.getElementById('include-lowercase').checked = lower;
        document.getElementById('include-numbers').checked = nums;
        document.getElementById('include-symbols').checked = syms;
    }

    // ==================== Regenerate Button ====================
    bindRegenerateButton() {
        const regenerateBtn = document.getElementById('regenerate-btn');
        regenerateBtn.addEventListener('click', () => this.generate());
    }

    generate() {
        const type = document.querySelector('input[name="generator-type"]:checked').value;
        const length = parseInt(document.getElementById('string-length').value) || 16;
        const quantity = parseInt(document.getElementById('quantity').value) || 1;
        const separator = this.getSeparator();

        let results = [];
        let displayLength = length;
        let displayType = this.getTypeLabel(type);

        try {
            for (let i = 0; i < quantity; i++) {
                let result;
                switch (type) {
                    case 'alpha':
                        result = this.generateFromOptions(length);
                        break;
                    case 'numeric':
                        result = this.generateNumeric(length);
                        break;
                    case 'alphanumeric':
                        result = this.generateFromOptions(length);
                        break;
                    case 'special':
                        result = this.generateFromOptions(length);
                        break;
                    case 'password':
                        result = this.generatePassword(length);
                        break;
                    case 'uuid':
                        result = this.generateUUID();
                        displayLength = 36;
                        break;
                    case 'hex':
                        result = this.generateHex(length);
                        break;
                    case 'custom':
                        result = this.generateCustom(length);
                        break;
                    default:
                        result = this.generateAlphanumeric(length);
                }
                results.push(result);
            }

            const output = results.join(separator);
            document.getElementById('output-text').value = output;
            this.saveToLocalStorage();

            // Update stats
            document.getElementById('stats').classList.remove('hidden');
            document.getElementById('generated-count').textContent = quantity;
            document.getElementById('string-length-stat').textContent = displayLength;
            document.getElementById('type-stat').textContent = displayType;

            this.showStatus(`Generated ${quantity} ${displayType} string(s)!`, 'success');
        } catch (error) {
            this.showStatus(error.message, 'error');
        }
    }

    getSeparator() {
        const sep = document.getElementById('separator').value;
        switch (sep) {
            case 'newline': return '\n';
            case 'comma': return ', ';
            case 'semicolon': return '; ';
            case 'space': return ' ';
            case 'tab': return '\t';
            default: return '\n';
        }
    }

    getTypeLabel(type) {
        const labels = {
            'alpha': 'Alphabetic',
            'numeric': 'Numeric',
            'alphanumeric': 'Alphanumeric',
            'special': 'Special',
            'password': 'Password',
            'uuid': 'UUID',
            'hex': 'Hexadecimal',
            'custom': 'Custom'
        };
        return labels[type] || type;
    }

    // ==================== Generation Methods ====================
    generateFromOptions(length) {
        let charset = '';
        if (document.getElementById('include-uppercase').checked) {
            charset += this.charsets.uppercase;
        }
        if (document.getElementById('include-lowercase').checked) {
            charset += this.charsets.lowercase;
        }
        if (document.getElementById('include-numbers').checked) {
            charset += this.charsets.numbers;
        }
        if (document.getElementById('include-symbols').checked) {
            charset += this.charsets.symbols;
        }

        if (!charset) {
            throw new Error('Please select at least one character type');
        }

        return this.generateFromCharset(charset, length);
    }

    generateNumeric(length) {
        return this.generateFromCharset(this.charsets.numbers, length);
    }

    generateAlphanumeric(length) {
        const charset = this.charsets.uppercase + this.charsets.lowercase + this.charsets.numbers;
        return this.generateFromCharset(charset, length);
    }

    generateHex(length) {
        return this.generateFromCharset(this.charsets.hex, length);
    }

    generateCustom(length) {
        const customChars = document.getElementById('custom-chars').value;
        if (!customChars) {
            throw new Error('Please enter custom characters');
        }
        return this.generateFromCharset(customChars, length);
    }

    generatePassword(length) {
        // Ensure at least one of each type for strong password
        const upper = this.charsets.uppercase;
        const lower = this.charsets.lowercase;
        const nums = this.charsets.numbers;
        const syms = this.charsets.symbols;
        const allChars = upper + lower + nums + syms;

        if (length < 4) {
            return this.generateFromCharset(allChars, length);
        }

        // Ensure at least one of each type
        let password = '';
        password += upper[this.getRandomInt(upper.length)];
        password += lower[this.getRandomInt(lower.length)];
        password += nums[this.getRandomInt(nums.length)];
        password += syms[this.getRandomInt(syms.length)];

        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            password += allChars[this.getRandomInt(allChars.length)];
        }

        // Shuffle the password
        return this.shuffleString(password);
    }

    generateUUID() {
        // Generate UUID v4
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        // Fallback for older browsers
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    generateFromCharset(charset, length) {
        let result = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            result += charset[array[i] % charset.length];
        }

        return result;
    }

    getRandomInt(max) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0] % max;
    }

    shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = this.getRandomInt(i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    // ==================== Copy Buttons ====================
    bindCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const targetElement = document.getElementById(targetId);

                if (targetElement && targetElement.value) {
                    navigator.clipboard.writeText(targetElement.value).then(() => {
                        const originalText = btn.textContent;
                        btn.textContent = '✓ Copied!';
                        btn.classList.add('copied');
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.classList.remove('copied');
                        }, 2000);
                    }).catch(() => {
                        this.showStatus('Failed to copy to clipboard', 'error');
                    });
                } else {
                    this.showStatus('Nothing to copy', 'error');
                }
            });
        });
    }

    // ==================== Download Buttons ====================
    bindDownloadButtons() {
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const contentId = btn.dataset.content;
                const filename = btn.dataset.filename || 'random_strings.txt';
                const contentElement = document.getElementById(contentId);

                if (contentElement && contentElement.value) {
                    const blob = new Blob([contentElement.value], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    this.showStatus('File downloaded successfully!', 'success');
                } else {
                    this.showStatus('Nothing to download', 'error');
                }
            });
        });
    }

    // ==================== Status Messages ====================
    showStatus(message, type = 'info') {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `status ${type}`;
        status.classList.remove('hidden');

        setTimeout(() => {
            status.classList.add('hidden');
        }, 3000);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new RandomGenerator();
    const yearElem = document.getElementById('currentYear');
    if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
    }
});
