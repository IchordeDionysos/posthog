import { Meta } from '@storybook/react'
import { useState } from 'react'

import { PropertyType } from '~/types'

import { EventPropertySelector } from './EventPropertiesSelector'

const meta: Meta = {
    title: 'Filters/Event Parameter Selector',
    parameters: {
        layout: 'centered',
    },
}
export default meta

export function EventParameterSelector_(): JSX.Element {
    const [properties] = useState([
        { id: 'id-user_id', name: 'user_id', type: PropertyType.String },
        { id: 'id-timestamp', name: 'timestamp', type: PropertyType.Numeric },
    ])

    return (
        <div className="w-160">
            <EventPropertySelector loading={false} value={properties} onChange={() => {}} onSave={async () => true} />
        </div>
    )
}
