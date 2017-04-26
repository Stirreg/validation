function Validation(form) {
  this.form = form;
  this.$form = $(form);
  this.init();
}

Validation.prototype = {
  init: function () {
    this.$form.attr('novalidate', '');
    this.$inputs = this.$form.find(':input').not(':submit, :hidden');
    this.setInputValidations();
    this.submitHandler();
    this.form.validation = this;
  },
  setInputValidations: function () {
    var self = this;
    this.$inputs.not('.js-validation-ignore').each(function () {
      self.setInputValidation(this);
    });
  },
  setInputValidation: function (input) {
    var config = {};
    if ($(input).is('select, [type=radio]')) {
      config = {
        showIcons: false
      };
    }
    new InputValidation(input, config); // eslint-disable-line no-new
  },
  addInput: function (input) {
    if (!this.$inputs.is(input)) {
      this.$inputs = this.$inputs.add(input);
      this.setInputValidation(input);
    }
  },
  removeInput: function (input) {
    if (this.$inputs.is(input)) {
      this.$inputs = this.$inputs.not(input);
      input.inputValidation.destroy();
    }
  },
  validate: function () {
    var valid = true;
    this.$inputs.each(function () {
      if (this.inputValidation.state === 'default') {
        $(this).trigger('blur');
      }
      if (this.inputValidation.state === 'error') {
        valid = false;
      }
    });
    return valid;
  },
  submitHandler: function () {
    var self = this;
    this.$form.on('submit', function (e) {
      if (!self.validate()) {
        e.preventDefault();
      }
    });
  },
  destroy: function () {
    this.$inputs.each(function () {
      this.inputValidation.destroy();
    });
  },
  reinitialize: function () {
    this.destroy();
    this.init();
  }
};
