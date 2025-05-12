import { LemonButton, LemonTag } from '@posthog/lemon-ui'
import { useActions, useValues } from 'kea'
import { TaxonomicFilter } from 'lib/components/TaxonomicFilter/TaxonomicFilter'
import { TaxonomicFilterGroupType } from 'lib/components/TaxonomicFilter/types'
import { LemonTable, LemonTableColumns } from 'lib/lemon-ui/LemonTable'
import { Popover } from 'lib/lemon-ui/Popover/Popover'
import { useEffect } from 'react'

import { PropertyDefinition, PropertyType } from '~/types'

import { eventPropertySelectorLogic } from './EventPropertySelectorLogic'

interface EventProperty {
    id: string
    name: string
    type: PropertyType | '-'
}

interface EventPropertySelectorProps {
    loading: boolean
    value: EventProperty[]
    onChange: (properties: EventProperty[]) => void
    onSave: (properties: EventProperty[]) => Promise<boolean>
}

export function EventPropertySelector(props: EventPropertySelectorProps): JSX.Element {
    const logic = eventPropertySelectorLogic(props)
    const { draftProperties, open } = useValues(logic)
    const { addProperty, removeProperty, save, setDraftProperties, setOpen } = useActions(logic)

    useEffect(() => {
        setDraftProperties(props.value)
    }, [props.value, setDraftProperties])

    const columns: LemonTableColumns<EventProperty> = [
        {
            title: 'Property',
            key: 'property',
            render: function Render(_: any, prop: EventProperty) {
                return <span className="font-medium">{prop.name}</span>
            },
        },
        {
            title: 'Type',
            key: 'type',
            render: function Render(_: any, prop: EventProperty) {
                return <LemonTag type="muted">{prop.type}</LemonTag>
            },
        },
        {
            title: '',
            key: 'actions',
            align: 'right',
            render: function Render(_: any, prop: EventProperty) {
                return (
                    <div className="flex justify-end">
                        <LemonButton
                            size="xsmall"
                            type="tertiary"
                            status="danger"
                            icon={<span className="text-danger">Remove</span>}
                            onClick={() => removeProperty(prop.id)}
                        />
                    </div>
                )
            },
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Popover
                    visible={open}
                    onClickOutside={() => setOpen(false)}
                    overlay={
                        <TaxonomicFilter
                            onChange={(_, __, item: PropertyDefinition) => {
                                addProperty(item)
                                setOpen(false)
                            }}
                            taxonomicGroupTypes={[TaxonomicFilterGroupType.EventProperties]}
                            selectFirstItem={false}
                        />
                    }
                >
                    <LemonButton size="small" type="secondary" onClick={() => setOpen(!open)}>
                        Add Property
                    </LemonButton>
                </Popover>
                <LemonButton size="small" type="primary" onClick={save}>
                    Save Properties
                </LemonButton>
            </div>

            <LemonTable
                dataSource={draftProperties}
                columns={columns as any}
                loading={props.loading}
                nouns={['required property', 'required properties']}
            />
        </div>
    )
}
