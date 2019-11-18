export interface MenuItem {
    icon: string;
    title: string;
    width: number;
    heigth: number;
}

export interface CarouselItem {
    img: string;
    title: string;
    text: string;
}

export interface InputData {
    placeholder: string;
    data: any[];
    icon: string;
}

export interface AutoCompleteData {
    placeholder: string;
    data: any[];
    icon: string;
    argument: string;
}

export interface StandarResponseHeader {
  Estado: boolean;
  Mensaje: string;
  Value: any[];
}
