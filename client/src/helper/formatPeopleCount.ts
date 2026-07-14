export default function formatPeopleCount(input: number) {
    const realNumber = input * 1000;

    const millions = Math.floor(realNumber / 1_000_000);
    const thousands = Math.floor((realNumber % 1_000_000) / 1000);

    let result = "";

    if (millions > 0) {
        result += `${millions.toLocaleString("fa-IR")} میلیون`;
    }

    if (thousands > 0) {
        if (millions > 0) result += " و ";
        result += `${thousands.toLocaleString("fa-IR")} هزار`;
    }

    result.toString();

    return result;
}