var React = require('react');
var example = JSON.stringify({
        schema: {
            'field': {}
        },
        fieldsets: [{
            fields: []
        }]
    },
    null, '\t');

export default function Schema(props) {
    return (<div>
        <h3>Schema</h3>
        <fieldset>
            <legend></legend>
            <p className="lead">
                The subschema schema was borrowed from backbone-forms. It seems reasonable enough, though I don't
                guarantee compatibilty.
            </p>
                <pre>
                    {example}
                </pre>
        </fieldset>
    </div>);
}
