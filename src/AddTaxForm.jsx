import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import styles from './AddTaxForm.module.css'
// import data from './data';

export default function AddTaxForm({ appliedToData, list }) {
    const formRef = useRef();

    const [categories, setCategories] = useState([])
    const [organizedItems, setOrganizedItems] = useState(null)
    const [applicableItems, setApplicableItems] = useState([])
    const [rate, setRate] = useState(0);
    const [name, setName] = useState('');
    const [appliedTo, setAppliedTo] = useState('some');
    const [selectedItems, setSelectedItems] = useState(0);

    const submitForm = () => {
        if (formRef.current) {
            if (formRef.current.isValid) {
                formRef.current.handleSubmit();
            }
        }
    }

    useEffect(() => {
        if (list && applicableItems) {
            const items = {}
            const categories = []
            let numberOfInitialCheckedItems = 0;
            list.forEach((item) => {
                if (applicableItems.includes(item.id)) {
                    item.checked = true;
                    numberOfInitialCheckedItems++;
                } else {
                    item.checked = false;
                }

                if (item?.category?.id && item.category.name) {
                    if (items.hasOwnProperty(item.category.name)) {
                        items[item.category.name].push(item)
                    } else {
                        items[item.category.name] = [item]
                        categories.unshift(item.category)
                    }
                    item.category.checked = false;
                } else {
                    if (items.hasOwnProperty("Other")) {
                        items["Other"].push(item)
                    } else {
                        items["Other"] = [item]
                        categories.push({ name: "Other", checked: false })
                    }
                }
            })
            setSelectedItems(numberOfInitialCheckedItems);

            setCategories(categories)
            setOrganizedItems(items)
        }
    }, [list, applicableItems])

    useEffect(() => {
        if (appliedToData) {
            setApplicableItems(appliedToData["applicable_items"])
            setRate(appliedToData["rate"])
            setName(appliedToData["name"])
            setAppliedTo(appliedToData["applied_to"])
        }
    })

    const handleCheckboxChange = (itemIndex, category, applied) => {
        if (applied === "some") {
            const updatedOrganizedItems = organizedItems;
            const updatedCategories = categories;
            updatedOrganizedItems[category][itemIndex].checked = !updatedOrganizedItems[category][itemIndex].checked;
            if (updatedOrganizedItems[category][itemIndex].checked) {
                setSelectedItems(selectedItems + 1);

            } else {
                setSelectedItems(selectedItems - 1);
                (updatedCategories.find((item)=> item.name === category)).checked = false
            }

            setOrganizedItems(updatedOrganizedItems)
        }

    }

    const handleCategoryCheckbox = (categoryIndex, applied) => {
        if (applied === "some") {
            const updatedOrganizedItems = organizedItems;
            const updatedCategories = categories;
            const categoryName = categories[categoryIndex].name;
            updatedCategories[categoryIndex].checked = !updatedCategories[categoryIndex].checked;

            let updatedSelectedNumber = 0;

            updatedOrganizedItems[categoryName].forEach((item) => {
                if (updatedCategories[categoryIndex].checked) {
                    if (!item.checked) {
                        updatedSelectedNumber++;
                    }
                    item.checked = true;
                } else {
                    if (item.checked) {
                        updatedSelectedNumber--;
                    }
                    item.checked = false
                }
            })
            setSelectedItems(selectedItems + updatedSelectedNumber)
            setCategories(updatedCategories)
            setOrganizedItems(updatedOrganizedItems);
        }

    }

    const selectAll = () => {
        const updatedOrganizedItems = organizedItems;
        categories.forEach((category) => {
            updatedOrganizedItems[category.name].forEach((item) => {
                item.checked = true;
            })
        })

        const updatedCategories = categories;
        updatedCategories.forEach((category) => {
            category.checked = true;
        })

        setSelectedItems(list.length)

        setCategories(updatedCategories)
        setOrganizedItems(updatedOrganizedItems);
    }

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.header}>
                    <p>Add Tax</p>
                    <p>X</p>
                </div>
                <Formik
                    enableReinitialize
                    initialValues={{ applicableItems, rate, name, appliedTo, organizedItems, categories }}
                    validate={values => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = 'Required name';
                        }

                        if (!values.rate) {
                            errors.rate = "Required rate"
                        }
                        return errors;
                    }}
                    innerRef={formRef}
                    onSubmit={(values) =>
                        console.log(values, "values")
                        // alert("congrats , tax was updated")
                    }
                >
                    {({ values }) => (
                        <Form className={styles.form} >
                            <div className={styles.inputs}>
                                <div className={styles.fields}>
                                    <span className={styles.input__container + ' ' + styles.name__container}><Field type="text" name="name" className={styles.name__input} /></span>
                                    <span className={styles.input__container + ' ' + styles.rate__container}><Field type="number" name="rate" className={styles.rate__input} />%</span>
                                </div>
                                <div className={styles.errors}>
                                    <ErrorMessage name="name" component="div" />
                                    <ErrorMessage name="rate" component="div" />
                                </div>
                            </div>
                            <div role="group" aria-labelledby="my-radio-group" className={styles.radio__group}>
                                <label className={styles.radio__label}>
                                    Apply to all items in collection
                                    <Field onClick={selectAll} type="radio" name="appliedTo" value="all" />
                                    <span className={styles.mark + ' ' + styles.radio__mark}></span>
                                </label>
                                <label className={styles.radio__label}>
                                    Apply to specific items
                                    <Field type="radio" name="appliedTo" value="some" />
                                    <span className={styles.mark + ' ' + styles.radio__mark}></span>
                                </label>
                            </div>
                            <hr className={styles.line} />
                            <div className={styles.options}>
                                {
                                    values.organizedItems !== null &&
                                    values.categories.map((category, index) => {
                                        return (
                                            <div key={`category-${index}`} className={styles.category}>
                                                <label className={styles.radio__label + ' ' + styles.category__label}
                                                    key={`category-item-${index}`} >
                                                    {category.name}
                                                    <Field
                                                        type="checkbox"
                                                        name={`values.categories[${index}]`}
                                                        value={`values.categories[${index}].checked`}
                                                        checked={values.categories[index].checked}
                                                        onClick={() => handleCategoryCheckbox(index, values.appliedTo)}
                                                    />
                                                    <span className={styles.mark + ' ' + styles.check__mark}></span>
                                                </label>
                                                {
                                                    values.organizedItems[category.name].map((item, itemIndex) => {
                                                        return (
                                                            <label className={styles.radio__label + ' ' + styles.item__label}
                                                                key={`item-${index}-${item.id}`} >
                                                                {item.name}
                                                                <Field
                                                                    key={`field-${item.id}`}
                                                                    type="checkbox"
                                                                    name={`values.organizedItems[${category.name}][${itemIndex}]`}
                                                                    value={`values.organizedItems[${category.name}][${itemIndex}].checked`}
                                                                    checked={values.organizedItems[category.name][itemIndex].checked}
                                                                    onClick={() => handleCheckboxChange(itemIndex, category.name, values.appliedTo)}
                                                                />
                                                                <span className={styles.mark + ' ' + styles.check__mark}></span>
                                                            </label>
                                                        )
                                                    })}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <hr />
            <button type="submit" onClick={submitForm} className={styles.submit__button} >
                Apply Tax to {selectedItems} item(s)
            </button>
        </div>
    )
}
