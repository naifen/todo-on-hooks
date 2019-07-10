export interface TodoProps {
    id: string;
    task?: string;
    complete: boolean;
}

export interface TodoAction {
    type: string;
    id?: string;
    payload: TodoProps[];
}

export interface FilterProps {
    dispatch: ({ type }: { type: string }) => void;
}

export interface FilterAction {
    type: string;
}

export interface FetchState {
    isLoading: boolean;
    isError: boolean;
}

export interface FetchAction {
    type: string;
}
