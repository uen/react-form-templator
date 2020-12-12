import React from 'react';
import { View } from 'react-native';
import {
  IElementSchema,
  IFormSchema,
  ILayoutSchema,
  IForm
} from './interfaces';

import {
  Templator,
  registerElement,
  registerLayoutElement,
  registerElements,
  registerLayoutElements
} from './templator';

export function Form({ schema, onSubmit, dynamicProps, ...props }: IForm) {
  return (
    <Templator
      onSubmit={onSubmit}
      dynamicProps={dynamicProps}
      schema={schema}
      formElement={(submit: () => void) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          {...props}
        />
      )}
    />
  );
}

export function NativeForm({
  schema,
  onSubmit,
  dynamicProps,
  ...props
}: IForm) {
  return (
    <Templator
      onSubmit={onSubmit}
      dynamicProps={dynamicProps}
      schema={schema}
      formElement={() => <View {...props} />}
    />
  );
}

export type { IElementSchema, ILayoutSchema, IFormSchema };
export {
  registerElement,
  registerLayoutElement,
  registerElements,
  registerLayoutElements
};
