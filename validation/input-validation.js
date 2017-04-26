function InputValidation(input, config) {	
  this.input = input;
  this.$input = $(input);
  this.state = 'default';
  this.$hint = $('[data-validation-hint-for=' + this.input.id + ']');
  this.config = {
    auto: true,
    showIcons: true,
    showHints: this.$hint.length,
    successIcon: '<i class="Overlay Overlay--Right ValidationTargetIcon ValidationTargetIcon--Success Overlay--CenterY Icon Icon--Check--Green" aria-hidden="true"></i>',
    errorIcon: '<i class="Overlay Overlay--Right ValidationTargetIcon ValidationTargetIcon--Error Overlay--CenterY Icon Icon--CrossCircle--Red" aria-hidden="true"></i>',
    wrap: '<div class="HasOverlay"></div>',
    hasErrorHint: this.$input.is('[data-validation-error]'),
    defaultHint: '',
  	errorHint: '',
    hasDefaultHint: this.$input.is('[data-validation-default]'),
    hasDataConfig: this.$input.is('[data-validation-config]')
  };

  if (this.config.hasDefaultHint) {
    this.config.defaultHint = this.$input.attr('data-validation-default');
  }
  if (this.config.hasErrorHint) {
    this.config.errorHint = this.$input.attr('data-validation-error');
  }
  if (this.config.hasDataConfig) {
    this.config = $.extend(this.config, JSON.parse(this.$input.attr('data-validation-config')));
  }
  this.config = $.extend(this.config, config);
  this.input.inputValidation = this;
  this.init();
}

InputValidation.prototype = {
  init: function () {
    if (this.config.showIcons) {
      this.$input.wrap(this.config.wrap);
      this.$successIcon = $(this.config.successIcon);
      this.$errorIcon = $(this.config.errorIcon);
      this.$input.after(this.$successIcon);
      this.$input.after(this.$errorIcon);
    }
    if (this.config.auto) {
      this.bindValidations();
    }
  },
  bindValidations: function () {
    var self = this;
    this.$input
    .on('focus', function () {
      self.showDefaultState();
    })
    .on('blur', function () {
      var validateNotEmptySuccess = true;
      if (self.$input.is('[required]')) {
        self.validateRequired();
        validateNotEmptySuccess = false;
      }
      if (self.$input.is('[pattern]')) {
        self.validatePattern();
        validateNotEmptySuccess = false;
      }
      // default behaviour
      if (validateNotEmptySuccess) {
        self.validateNotEmptySuccess();
      }
    })
    .on('change', function () {
      if (self.$input.is('select')) {
        self.validateNotEmptySuccess();
      }
    });
  },
  hasEmptyValueAfterTrim: function () {
    var value = this.input.value.trim();
    return value.length === 0;
  },
  validateRequired: function () {		 
    if (this.hasEmptyValueAfterTrim()) {
      this.showErrorState();
    } else {
      this.showSuccessState();
    }
  },
  validatePattern: function () {
    if (!this.input.value.match(this.input.pattern)) {
      this.showErrorState();
    } else {
      if (this.hasEmptyValueAfterTrim()) {
        this.showDefaultState();
      } else {
        this.showSuccessState();
      }
    }
  },
  validateNotEmptySuccess: function () { // to show success for non empty optional input
    if (this.hasEmptyValueAfterTrim()) {
      this.showDefaultState();
    } else {
      this.showSuccessState();
    }
  },
  showSuccessState: function () {
    if (this.config.showHints) {
      this.showDefaultHint();
    }
    this.hideErrorState();
    this.$input.addClass('ValidationTarget--Success');
    this.state = 'success';
  },
  hideSuccessState: function () {
    this.$input.removeClass('ValidationTarget--Success');
  },
  showErrorState: function () {
    if (this.config.showHints && this.config.hasErrorHint) {
      this.showErrorHint();
    }
    this.hideSuccessState();
    this.$input.addClass('ValidationTarget--Error');
    this.state = 'error';
  },
  showDefaultState: function () {
    this.hideErrorState();
    this.hideSuccessState();
    if (this.config.showHints) {
      this.showDefaultHint();
    }
    this.state = 'default';
  },
  hideErrorState: function () {
    this.$input.removeClass('ValidationTarget--Error');
  },
  showErrorHint: function () {
    this.$hint.addClass('Form__Hint--HasError').text(this.config.errorHint);
  },
  showDefaultHint: function () {
    this.$hint.removeClass('Form__Hint--HasError').text(this.config.defaultHint);
  },
  destroy: function () {
    if (this.config.showIcons) {
      this.$input.unwrap(this.config.wrap);
      this.$successIcon.remove();
      this.$errorIcon.remove();
    }
    this.$input.off('focus, blur, change');
    this.showDefaultState();
    delete this.input.inputValidation;
  }
};
