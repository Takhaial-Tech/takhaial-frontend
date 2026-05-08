export const homeInputsData = [
    {
        control: "input",
        type: "text",
        name: "title",
        placeholder: "Home Header",
        placeholderAr: "Home Header",
        className: 'block md:w-full w-[100%] ',
        containerClassName: 'block w-full'
    },
    {
        control: "input",
        type: "text",
        name: "titleAr",
        placeholder: "Home Header (Arabic)",
        placeholderAr: "Home Header (Arabic)",
        className: 'block md:w-full w-[100%] ',
        containerClassName: 'block w-full',
        dir: 'rtl',
    },
    {
        control: "textarea",
        name: "disc",
        placeholder: "Home Description",
        placeholderAr: "Home Description",
        className: 'block md:w-full ',
        rows:5,
    },
    {
        control: "textarea",
        name: "discAr",
        placeholder: "Home Description (Arabic)",
        placeholderAr: "Home Description (Arabic)",
        className: 'block md:w-full ',
        rows:5,
        dir: 'rtl',
    },
]
