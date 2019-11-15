export class Alerter {
  static _dialog;
  static setDialog = dialog => (_dialog = dialog);
  static error = (title, message) =>
    _dialog.alertWithType('error', title, message);
}
