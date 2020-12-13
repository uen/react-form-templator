![React Templator Logo](https://i.imgur.com/3GT3syb.png)

<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h1 align="center">React Templator</h3>

  <p align="center">
    A small 8kb library for automatic form generation & validation in React & React Native. Define form schemas using your own components and have error handling, layout, auto-refocus and more handled for you.
</p>

<!-- ABOUT THE PROJECT -->

# Overview

Creating forms in React & React Native with good UX can be a pain. If you have a form with 20 inputs, that's 20 new values in your state, 20 new refs to get them to autofocus and hundreads of lines of error handling logic. But it shouldn't be this way - your form containers should only be focussed on the business-logic of your form. That's where React Templator comes in.

React Templator allows you to define a `schema` for each form in your application. This is an array of inputs and layout elements for each form. Once you've defined your input components, your form will automatically be generated with **your components** and all error handling and other 'UX features' will be handled for you.

React Templator is dynamic and does not define any form components, instead you use your own. You simply pass an array of `elements` to `<FormProvider>` and you can use them in your schemas!

# Installation

```sh
npm install react-templator
// or
yarn add react-templator
```

## Usage

- Deifne a list of components you want to use in your form. You only have to do this once per application.

```javascript
const elements = {
  'text-input': ({
    name,
    label,
    tabIndex,
    error,
    yourProp,
    ref,
    value,
    onChange,
    validate
  }) => (
    <div>
      {yourProp} {label}
      <input
        type='text'
        name={name}
        value={value}
        tabIndex={tabIndex}
        ref={ref}
        onChange={(event) => {
          onChange(event.currentTarget.value);
        }}
        onBlur={() => validate(false)}
      />
      <div className='error'>{error}</div>
    </div>
  ),
  submit: ({ label, tabIndex, value }) => (
    <input type='submit' tabIndex={tabIndex} value={label} />
  )
};
```

- Wrap your entire app or form page in a `<FormProvider/>`

```javascript
// app.js
import { FormProvider } from "react-templator";

import { elements } from "./your-elements";

render(){
  <FormProvider elements={elements}>
    // Your app
  </FormProvider>
}
```

- Create a form schema for your form, which defines the inputs in your form. Here, we'll define two text inputs and a submit button.

```javascript
const schema = [
  {
    // Required fields
    type: 'text-input',
    name: 'first_name',
    label: 'First name',

    // Additional fields (these are passed to your component and can be anything)
    yourProp: 'A field: ',

    // Validators
    required: true,
    minLength: 2,
    maxLength: 50
  },
  {
    type: 'text-input',
    name: 'last_name',
    label: 'Last name',

    yourProp: 'Another: ',

    required: true
  },
  {
    type: 'submit',
    name: 'submit'
  }
];
```

- Finally, use the `<Form/>` component and pass it your schema, and onSubmit function.

```javascript
<Form
  schema={schema}
  onSubmit={(data) => {
    // Called when the form has submitted and all the local validation has passed
    alert('Form submitted! Data:', JSON.stringify(data));
  }}
/>
```

This is the result of our example:
![Example result](https://i.imgur.com/SvdaWsk.gif)

## Dynamic props

This is nice for static forms, but what about forms that require custom properties such as loading states & custom data & errors from a server?

React Templator handles this functionality with `dynamicProps`. Simply pass a `dynamicProps` prop to the `<Form/>`, which is a {"input-name": props} object, to have different props automatically passed to your component. In the following example, we'll define a new Select component with custom data and also add a loading state to our button.

```javascript
const elements = {
  // ..Your other inputs

  'select': ({
    ref,
    name,
    label,
    error,
    value,
    tabIndex,
    yourProp,
    onChange,

    // Dynamic props
    options=[]
  }) => (
    <div>
      {label}
      <select
        name={name}
        onBlur={() => validate(false)}
        onChange={(event) => {
          onChange(event.currentTarget.value);
        }
      }>
        {options.map((option) => (
          <option value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="error">{error}</div>
    </div>
  ),

  submit: ({
    label,
    value,
    tabIndex,

    // Dynamic props
    isLoading,
  }) => (
    <input
      type='submit'
      tabIndex={tabIndex}
      value={isLoading ? "Loading..." : label}
    />
  )
```

- And we'll modify our schema to add our new select component

```javascript
const schema = [
  {
    type: 'select',
    name: 'fave_color',
    label: 'Favourite color',
    required: true
  }
];
```

- When we render our `<Form/>` component, we can proide it with a `dynamicProps` prop to give our new select component some options, and our submit button a loading state. We'll also fake a server error if the last name is not `vrondakis`.

```javascript
const [isLoading, setIsLoading] = useState();

<Form
  schema={schema}
  dynamicProps={{
    submit: {
      isLoading
    },
    fave_color: { colors }
  }}
  onSubmit={(data, setErrors) => {
    setIsLoading(true);

    // Fake a network request
    setTimeout(() => {
      setIsLoading(false);

      // Fake an error from the server
      if (data.last_name !== 'vrondakis') {
        return setErrors({
          last_name: "Last name must be 'vrondakis'"
        });
      }

      alert(`Form submitted! Data: ${JSON.stringify(data)}`);
    }, 2000);
  }}
/>;
```

- The result of the previous example is:
  ![Example dynamic props](https://i.imgur.com/qfmpza9.gif)

## Layout elements

Wha if you don't want a simple list of elements in your form, and instead want a form with a different layout, such as two field snext to eachother, or different section labels? This is where `layoutElements` come in.

You can define layout elements which can have unlimited nested form inputs / other form layouts! Layouts can also have custom props passed into them from the schema, just like form inputs.

- Start by defining your layout element

```javascript
const layoutElements = {
  section: ({ children, customProps, yourProp }) => (
    <div
      style={{
        marginBottom: 10,
        backgroundColor: 'rgba(255,0,0,.4)'
      }}
    >
      {yourProp}
      <div>{children}</div>
    </div>
  )
};
```

- Then you can pass your layout elements into your `<FormProvider/>` component just like you did with your elements.

```javascript
<FormProvider elements={elements} layoutElements={layoutElements} />
```

- You can now use your new layout element in your form schema.

```
const schema: IFormSchema = [
  ...
  {
    type: "section",
    yourProp: "Your dog",
    children: [
      {
          type: 'text-input',
          name: 'dog-name',
          label: 'Name',
          required: true
        },

              {
          type: 'text-input',
          name: 'breed',
          label: 'Breed',
          required: true
        },
    ]
  },
  {
    type: 'submit',
    name: 'submit'
  }
];
```

The result of our example is this:

![Example layout](https://i.imgur.com/HGgHKlI.gif)

## Validators

### Default validators

```
"required"          => Requires the value to be there
"number"            => Requires the value to be a number
"minLength": 4      => Requires the value to be at least 4 characters
"maxLength": 18     => Requires the value to be a maximum of 18 characters
```

### Provider-wide validators

You can provide a `validators` object to your `<FormProvider/>` to define your own validators which can be used on any element in your schema.

- This example defines a validator which an expects an object with a specific property:

```
const validators = {
  "has-property": (name, value, data) => !value || !value[data] ? `${name} must have ${data}`
}

...

<FormProvider elements={elements} validators={validators}/>
```

- Then you can use it in your schema:

```
const schema = {
  {
    type: 'text-input',
    name: 'last_name',
    label: 'Last name',
    "has-property": "some-property"
  }
}
```

- This will validate that the input value is an object with a "some-property" property.

### Specific element validators

Each element in a schema can also provide its own validator through the use of the `validator` property, which takes a function with parameters of `validator name` and `validatior function`. This function should return `false` if there is no error, and `string` if there is an error.

```
const schema = [
  {
    type: 'text-input',
    name: 'last_name',
    label: 'Last name',
    validator: (name, value) => name !== "hello" && `${name} must he 'hello'`
  }
]
```

# Usage with React Native

Since React Templator comes with no UI components, using the library with React Native is just as easy as React, with a few differences.

- Instead of the `<Form/>` component, be sure to use the `<FormNative>`

- Instead of using `onBlur` to validate your components, use `onSubmitEditing` and pass `true` to validate (refocus input).

- Since React Native doesn't have the concept of forms or submitting them, you need to add some extra logic to your submit button component to get it to submit the form. Every element in your schema is passed a `submit` property, which you can use to submit your form. For example:

```
const elements = {
  "submit": ({submit}) => (
    <TouchableOpacity onPress={submit}><Text>Submit</Text>
  )
}
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Manolis Vrondakis - [@vrondakis](https://twitter.com/vrondakis) - manolisvrondakis@gmail.com
