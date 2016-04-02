var React = require('react');
var example = JSON.stringify({
        schema: {
            'field': {
                type: "Text",
                title: "The Label (false for no label)",
                validators: [{
                    type: "required",
                    message: "The message is optional, type isn't, no validators no validation"
                }],
                template: {
                    "template": "EditorTemplate (is the default)",
                    "className": "Any other property described in the templates PropTypes"
                },
                conditional: {
                    listen: "path.to.value",
                    operator: '==',
                    value: true
                }
            }
        },
        fieldsets: [{
            legend: 'The legend for fieldset (optional)',
            content: "A content object that will display content",
            template: "The template to use (By Default uses FieldSetTemplate)",
            fields: "field a comma delimited string or an array of strings",
            fieldsets: [{
                legend: "Recursively define a fieldset using the schema.  Short circuits on fieldsets with fields."
            }]
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
