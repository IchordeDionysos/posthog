import { useActions, useValues } from 'kea'
import api from 'lib/api'
import { EventPropertySelector } from 'lib/components/EventPropertiesSelector/EventPropertiesSelector'
import { useEffect } from 'react'

import { EventDefinition, PropertyType } from '~/types'

import { requiredPropertiesLogic } from './requiredPropertiesLogic'

interface EventProperty {
    id: string
    name: string
    type: PropertyType | '-'
}

export function EventDefinitionRequiredProperties({ definition }: { definition: EventDefinition }): JSX.Element {
    const logicProps = { definition }
    const { requiredProperties, loading } = useValues(requiredPropertiesLogic(logicProps))
    const { setRequiredProperties, loadRequiredProperties } = useActions(requiredPropertiesLogic(logicProps))

    useEffect(() => {
        loadRequiredProperties()
    }, [definition.id])

    const handleRequiredPropertiesChange = (properties: EventProperty[]): void => {
        setRequiredProperties(properties)
    }

    const handleSaveRequiredProperties = async (properties: EventProperty[]): Promise<boolean> => {
        try {
            await api.eventDefinitions.update({
                eventDefinitionId: definition.id,
                eventDefinitionData: {
                    required_properties: properties.map((p) => p.id),
                },
            })
            return true
        } catch (error) {
            console.error('Failed to save required properties:', error)
            return false
        }
    }

    return (
        <div>
            <h3>Required Properties</h3>
            <p>
                Select the required properties for this event. These properties must be present when the event is sent.
            </p>
            <EventPropertySelector
                value={requiredProperties}
                loading={loading}
                onChange={handleRequiredPropertiesChange}
                onSave={handleSaveRequiredProperties}
            />
        </div>
    )
}
