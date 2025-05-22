export interface IAlert {
  type: 'default' | 'warning' | 'error';
  text: string;
}

export interface IButton {
  type: 'submit' | 'reset' | 'button' | undefined;
  click: React.MouseEventHandler<HTMLButtonElement> | undefined;
  disabled: boolean | undefined;
  text: string;
}

export interface IResult {
  result: string | undefined;
  confidence: string | undefined;
}
