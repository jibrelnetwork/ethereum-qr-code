import {
    isAddress
} from './utils';

const adressBlockParams = ['gas', 'value'];
const requiredElements = new RegExp(/[\[\]]/);

export const readString = (str) => {
    let result = {};
    if (!str || str.substr(0, 9) !== 'ethereum:') return false;
    if (str.length >= 51 && isAddress(str.substr(9, 42))) {
        result.to = str.substr(9, 42);
    }
    if (str.length > 51 && requiredElements.test(str)) {

        const exStr = str.substr(51).split(']');
        exStr.forEach((element, i) => {
            adressBlockParams.forEach(segment => {
                const segmentQueryPart = `[?${segment}=`;
                if (element.indexOf(segmentQueryPart) === 0) {
                    result[segment] = element.substr(segmentQueryPart.length);
                }
            });
        });

    }
    return result;
}