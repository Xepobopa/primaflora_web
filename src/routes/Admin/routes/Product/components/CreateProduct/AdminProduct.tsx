import { useEffect, useState } from 'react';
import { RawDraftContentState } from 'draft-js';
import { useUserData } from '../../../../../../store/tools';
import { Tag } from '../../../../../../components/TagsInput/types';
import { Row } from '../../../../../../components/common';
import { Column } from '../../../../../../components/common/Column';
import { Panel } from '../../../../components/Panel';
import { DescriptionEditor } from '../../../../components/CreateProduct/components/DescriptionEditor';
import { TagsInput } from '../../../../../../components/TagsInput';
import { ProductPreview } from '../ProductPreview';
import './styles.css';
import { TProduct } from '../../../../../../common/services/product/types';
import { Service } from '../../../../../../common/services';
import { TProductPayload } from '../../../../../../common/services/product/types/postCreateProduct';

export const AdminProduct = () => {
    const { categories } = useUserData();
    const [description, setDescription] = useState<RawDraftContentState>();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [card, setCard] = useState<Partial<TProduct>>();
    const [notification, setNotification] = useState<string>();

    const updateCard = (key: keyof Partial<TProduct>, value: string | number) => {
        setCard(prevState => ({...prevState, [key]: value}));
    }

    const handleDescriptionApply = (state: RawDraftContentState) => {
        setDescription(state);
    }

    const categoriesToTags = () => {
        const arr: Tag[] = [];
        categories.forEach(category => {
            category.childrens.forEach(subcategory => {
                arr.push({ label: subcategory.name, value: subcategory.id.toString() });
            })
        })

        return arr;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedTags.length === 0) {
            setNotification('Select at least one category!');
            return;
        }

        const formData = new FormData(e.currentTarget);

        // check if all fields are filled
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        })

        // create payload for request
        const payload: TProductPayload = {
            photo_url: formData.get('photo_url') as string,
            price_currency: Number(formData.get('price_currency')),
            price_points: 0,
            percent_discount: 0,
            categoryId: Number(selectedTags[0].value),
            translate: [
                {
                    language: 'ukr',
                    title: formData.get('title') as string,
                    shortDesc: formData.get('shortDesc') as string,
                    desc: JSON.stringify(description)
                }
            ]
        }

        console.log(payload);
        Service.ProductService.create(payload)
        .then(() => {
            setNotification(`Product ${formData.get('title') as string} created!`);
        })
        .catch((err) => {
            console.log(err);
            setNotification('Something went wrong!');
        })
    }

    const handlePreview = () => {

    }

    const handleAddTag = (tag: Tag) => {
        setSelectedTags([...selectedTags, tag]);
    }

    const handleRemoveTag = (tag: Tag) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    }

    return (
        <div>
            <Panel.Title text='Create Product!' />

            { notification && 
                <Panel.Notification 
                    onRemove={() => setNotification(undefined)}>
                        { notification }
                </Panel.Notification> 
            }

            <Row style={{ gap: '20px', alignItems: 'normal' }}>
                <Column style={{ width: '65%', gap: '20px', marginBottom: '20px' }}>
                    <Panel.Form onSubmit={handleSubmit}>
                        <Panel.Container>
                            <Panel.Header title='Create Product' />
                            <Panel.Body style={{ gap: '15px' }}>
                                    <Panel.FormInput 
                                        onTextChange={(newText) => updateCard('title', newText)}
                                        defaultValue={card?.title} 
                                        name='title'
                                        title='Title' />
                                    <Row style={{ gap: '15px', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Panel.FormInput 
                                            defaultValue={card?.photo_url} 
                                            onTextChange={(newText) => updateCard('photo_url', newText)}
                                            title='Image (URL)' 
                                            name='photo_url'
                                            type='url' 
                                            style={{ width: '150%' }} />
                                        <Panel.FormInput 
                                        name='price_currency'
                                        defaultValue={card?.price_currency} 
                                        onTextChange={(newText) => updateCard('price_currency', Number(newText))}
                                        title='Price' 
                                        type='number' />
                                    </Row>
                                    <Panel.FormInput 
                                        defaultValue={card?.shortDesc} 
                                        title='Short description' 
                                        name='shortDesc'
                                        onTextChange={(newText) => updateCard('shortDesc', newText)}
                                        isTextArea />
                                    {/* <Panel.Checkbox label='Is Hidden' onChange={() => {}} /> */}
                            </Panel.Body>
                            <Panel.Body>
                                <Panel.Tip>
                                    <b>Important!</b> To create product you have to click 
                                    <code> <b>Apply text</b> </code> 
                                    button first to save your description.
                                </Panel.Tip>
                                <DescriptionEditor defaultRawState={description} onEditorChange={handleDescriptionApply}/>    
                            </Panel.Body>
                        </Panel.Container>
                        <Panel.Button text={'Create Product'} type='submit' />
                    </Panel.Form>
                </Column>
                <Column style={{ maxWidth: '35%', width: '35%', gap: '20px' }}>
                    <Panel.Container>
                        <Panel.Header title='Preview' />
                        <Panel.Body>
                            <ProductPreview card={card} descriptionRaw={description} />
                        </Panel.Body>
                    </Panel.Container>

                    <Panel.Container>
                        <Panel.Header 
                            title='Select Category'
                            style={{ textAlign: 'center', justifyContent: 'space-between' }}>
                                <Panel.Link to='/admin-page/categories' text='View all' />
                        </Panel.Header>
                        <Panel.Body>
                            <TagsInput 
                                tags={categoriesToTags()} 
                                selectedTags={selectedTags}
                                onTagAdd={handleAddTag}
                                onTagRemove={handleRemoveTag} />
                        </Panel.Body>
                    </Panel.Container>
                </Column>
            </Row>
        </div>
    );
};