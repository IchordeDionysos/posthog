import { actions, kea, key, KeyType, path, props, reducers } from 'kea'
import { loaders } from 'kea-loaders'
import api from 'lib/api'

import { EventDefinition, PropertyType } from '~/types'

import type { requiredPropertiesLogicType } from './requiredPropertiesLogicType'

export interface EventProperty {
    id: string
    name: string
    type: PropertyType | '-'
}

export interface RequiredPropertiesLogicProps {
    definition: EventDefinition
}

export const requiredPropertiesLogic = kea<requiredPropertiesLogicType>([
    path((key: KeyType) => ['scenes', 'data-management', 'requiredProperties', 'requiredPropertiesLogic', key]),
    props({} as RequiredPropertiesLogicProps),
    key((props: RequiredPropertiesLogicProps) => props.definition.id),
    actions({
        setRequiredProperties: (properties: EventProperty[]) => ({ properties }),
    }),
    loaders(({ props }: { props: RequiredPropertiesLogicProps }) => ({
        requiredProperties: [
            [] as EventProperty[],
            {
                loadRequiredProperties: async () => {
                    const requiredIds = props.definition.required_properties || []
                    if (requiredIds.length === 0) {
                        return []
                    }
                    const fetchedProps = await Promise.all(
                        requiredIds.map((id: string) => api.propertyDefinitions.get({ propertyDefinitionId: id }))
                    )
                    return fetchedProps.map((prop) => ({
                        id: prop.id,
                        name: prop.name,
                        type: prop.property_type ?? '-',
                    }))
                },
            },
        ],
    })),
    reducers({
        loading: [
            false,
            {
                loadRequiredProperties: () => true,
                loadRequiredPropertiesSuccess: () => false,
                loadRequiredPropertiesFailure: () => false,
            },
        ],
        requiredProperties: [
            [] as EventProperty[],
            {
                setRequiredProperties: (_, { properties }) => properties,
            },
        ],
    }),
])
