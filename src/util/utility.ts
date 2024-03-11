export class Utility {
  static enumToArray(enumName): any[] {
    return Object.keys(enumName).map((key) => enumName[key]);
  }

  static arrayToObject(key, data): any {
    let obj = {};
    obj[key] = data;

    return obj;
  }

  static checkParameter(parameter: string) {
    if (parameter == undefined || parameter == ',' || parameter == 'All' || parameter.indexOf('Total') > -1) {
      parameter = null;
    }
    return parameter;
  }

  static isEmpty(obj): boolean {
    return undefined != obj && Object.keys(obj).length > 0;
  }

  static currentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    const strToday = yyyy + '/' + mm + '/' + dd;
    return { today: today, strToday: strToday };
  }

  static keyNameTransform(name: string): string {
    let key = name.trim();
    key = key.replace(/[^a-zA-Z0-9 ]/g, '');
    key = key.replace(/ /g, '_');
    key = key.toUpperCase();
    return key;
  }
}
