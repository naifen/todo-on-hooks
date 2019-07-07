export interface TodoProps {
    id: string;
    task: string;
    complete: boolean;
}

export interface TodoAction {
    type: string;
    id: string;
    task: string;
}

export interface FilterProps {
    dispatch: ({ type }: { type: string }) => void;
}

export interface FilterAction {
    type: string;
}
