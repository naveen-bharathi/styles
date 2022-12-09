/* eslint-disable max-len */
import fs from 'fs'
import prettier from 'prettier'

const styleConfig = JSON.parse(fs.readFileSync('./config/styles.json'))
const prettierConfig = prettier.resolveConfig.sync('./.prettierrc.json')
const {
  defaultPaddingGap,
  sideInfo,
  sides,
  sizeOrder,
  sizes,
} = styleConfig

function lowercase(string) {
  return string.toLowerCase()
}

const filePath = {
  designToken: {
    breakpoints: './design-tokens/breakpoints.css',
    margins: './design-tokens/margin.css',
    paddings: './design-tokens/padding.css',
  },
  properties: {
    applyProperty: './utils/properties/apply.css',
    margins: './utils/properties/margin.css',
    paddings: './utils/properties/padding.css',
  },
  viewports: './utils/viewport.css',
  viewportsExport: './config/viewports.ts',
  sizesExport: './config/sizes.ts',
}

const fileContent = {
  designToken: {
    breakpoints: '',
    margins: '',
    paddings: '',
  },
  properties: {
    applyProperty: `
      @import '../viewport.css';

      @define-mixin apply-property-responsively $PROPERTY, ${sizeOrder.map((size) => `$VALUE_${size}`).join(', ')}, $IS_IMPORTANT {
        ${(sizeOrder.map((size) => `
          @mixin ${lowercase(size)} {
            $(PROPERTY): setImportance($VALUE_${size}, $IS_IMPORTANT);
          }
        `).join(''))}
      }
    `,
    margins: `
      @import '../../design-tokens/margin.css';
      @import '../viewport.css';
    `,
    paddings: `
      @import '../../design-tokens/padding.css';
      @import '../viewport.css';
    `,
  },
  viewports: '',
  viewportsExport: '',
  sizesExport: Object.entries(sizes).map(([size, value]) => (
    `export const SIZE_${size.toUpperCase()} = { START: ${value[0] || 'null'}${value[1] ? `, END: ${value[1]}` : ''} }\n`
  )).join(''),
}

function getSizeMediaQuery(size) {
  const mediaQueries = []

  if (sizes[size][0]) {
    mediaQueries.push(`(min-width: ${sizes[size][0]}px)`)
  }

  if (sizes[size][1]) {
    mediaQueries.push(`(max-width: ${sizes[size][1]}px)`)
  }

  return mediaQueries.join(' and ')
}

function getInBetweenSizeMediaQuery(startSize, endSize) {
  const mediaQueries = []

  if (sizes[startSize]?.[0]) {
    mediaQueries.push(`(min-width: ${sizes[startSize][0]}px)`)
  }

  if (sizes[endSize]?.[1]) {
    mediaQueries.push(`(max-width: ${sizes[endSize][1]}px)`)
  }

  return mediaQueries.join(' and ')
}

const applyMarginPaddingPropertiesResponsively = (side, property) => (
  sizeOrder.map((size) => `
    @mixin ${lowercase(size)} {
      @mixin has-notch { 
        ${side.edge.map((edge) => `${sideInfo[edge][property]}: setImportance(getNotchValue(${edge}, conditionalValue($VALUE_${size}, $VALUE_${size}, ${(property === 'margin') ? '$MARGIN' : '$PADDING'}_${size})), $IS_IMPORTANT);`).join('')}
      }

      @mixin no-notch { 
        ${side.edge.map((edge) => `${sideInfo[edge][property]}: setImportance(conditionalValue($VALUE_${size}, $VALUE_${size}, ${(property === 'margin') ? '$MARGIN' : '$PADDING'}_${size}), $IS_IMPORTANT);`).join('')}
      }
    }
  `).join('')
)

const applyMarginPaddingProperties = (side, property) => (`
  @mixin has-notch { 
    ${side.edge.map((edge) => `${sideInfo[edge][property]}: setImportance(max(${(property === 'margin') ? '$MARGIN' : '$PADDING'}, env(safe-area-inset-${edge})), $IS_IMPORTANT);`).join('')}
  }

  @mixin no-notch { 
    ${side.edge.map((edge) => `${sideInfo[edge][property]}: setImportance(${(property === 'margin') ? '$MARGIN' : '$PADDING'}, $IS_IMPORTANT);`).join('')}
  }
`)

sizeOrder.forEach((size) => {
  fileContent.designToken.breakpoints += `$BREAKPOINT_${size}: ${sizes[size][0] || 0}px;\n`
  fileContent.designToken.paddings += `$PADDING_${size}: ${defaultPaddingGap[size]}px;\n`
  fileContent.designToken.margins += `$MARGIN_${size}: ${defaultPaddingGap[size]}px;\n`
  fileContent.viewports += `
    @define-mixin ${lowercase(size)} {
      @media only screen and ${getSizeMediaQuery(size)} {
        @mixin-content;
      }
    }
  `
  fileContent.viewportsExport += `export const VIEWPORT_${size} = '${getSizeMediaQuery(size)}';\n`
})

for (let i = 0; i < sizeOrder.length; i += 1) {
  for (let j = (i + 1); j < (sizeOrder.length + 1); j += 1) {
    if (
      ((!sizeOrder[j]) ? (i === (sizeOrder.length - 1)) : true)
      && (sizeOrder[i] !== sizeOrder[j])
      && (sizes[sizeOrder[i]]?.[0] || sizes[sizeOrder[j]]?.[1])
    ) {
      fileContent.viewports += `
          @define-mixin ${lowercase(sizes[sizeOrder[i]]?.[0] ? sizeOrder[i] : '')}_${lowercase(sizes[sizeOrder[j]]?.[1] ? sizeOrder[j] : '')} {
            @media only screen and ${getInBetweenSizeMediaQuery(sizeOrder[i], sizeOrder[j])} {
              @mixin-content;
            }
          }
        `
      fileContent.viewportsExport += `export const VIEWPORT_${sizes[sizeOrder[i]]?.[0] ? sizeOrder[i] : ''}_${sizes[sizeOrder[j]]?.[1] ? sizeOrder[j] : ''} = '${getInBetweenSizeMediaQuery(sizeOrder[i], sizeOrder[j])}';`
    }
  }
}

fileContent.properties.margins += `
  @define-mixin margin-x $VALUE, $IS_IMPORTANT {
    @mixin margin-start $VALUE, $IS_IMPORTANT;
    @mixin margin-end $VALUE, $IS_IMPORTANT;
  }

  @define-mixin margin-y $VALUE, $IS_IMPORTANT {
    margin-bottom: setImportance($VALUE, $IS_IMPORTANT);
    margin-top: setImportance($VALUE, $IS_IMPORTANT);
  }

  @define-mixin margin-start $VALUE, $IS_IMPORTANT {
    margin-inline-start: setImportance($VALUE, $IS_IMPORTANT);
  }
  
  @define-mixin margin-end $VALUE, $IS_IMPORTANT {
    margin-inline-end: setImportance($VALUE, $IS_IMPORTANT);
  }  

  ${sides.map((side) => (`
    @define-mixin notch-margin${side.code ? `-${side.code}` : ''} $MARGIN, $IS_IMPORTANT {
      ${applyMarginPaddingProperties(side, 'margin')}
    }
  `)).join('\n')}

  ${sides.map((side) => (`
    @define-mixin responsive-notch-margin${side.code ? `-${side.code}` : ''} ${sizeOrder.map((size) => `$VALUE_${size}`).join(', ')}, $IS_IMPORTANT {
      ${applyMarginPaddingPropertiesResponsively(side, 'margin')}
    }
  `)).join('\n')}
`

fileContent.properties.paddings += `
  @define-mixin padding-x $VALUE, $IS_IMPORTANT {
    @mixin padding-start $VALUE, $IS_IMPORTANT;
    @mixin padding-end $VALUE, $IS_IMPORTANT;
  }

  @define-mixin padding-y $VALUE, $IS_IMPORTANT {
    padding-bottom: setImportance($VALUE, $IS_IMPORTANT);
    padding-top: setImportance($VALUE, $IS_IMPORTANT);
  }

  @define-mixin padding-start $VALUE, $IS_IMPORTANT {
    padding-inline-start: setImportance($VALUE, $IS_IMPORTANT);
  }
  
  @define-mixin padding-end $VALUE, $IS_IMPORTANT {
    padding-inline-end: setImportance($VALUE, $IS_IMPORTANT);
  }

  ${sides.map((side) => (`
    @define-mixin notch-padding${side.code ? `-${side.code}` : ''} $PADDING, $IS_IMPORTANT {
      ${applyMarginPaddingProperties(side, 'padding')}
    }
  `)).join('\n')}

  ${sides.map((side) => (`
    @define-mixin responsive-notch-padding${side.code ? `-${side.code}` : ''} ${sizeOrder.map((size) => `$VALUE_${size}`).join(', ')}, $IS_IMPORTANT {
      ${applyMarginPaddingPropertiesResponsively(side, 'padding')}
    }
  `)).join('\n')}
`

//

fs.writeFileSync(
  filePath.designToken.breakpoints,
  prettier.format(fileContent.designToken.breakpoints, {
    ...prettierConfig,
    filepath: filePath.designToken.breakpoints,
  }),
)

fs.writeFileSync(
  filePath.designToken.margins,
  prettier.format(fileContent.designToken.margins, {
    ...prettierConfig,
    filepath: filePath.designToken.margins,
  }),
)

fs.writeFileSync(
  filePath.designToken.paddings,
  prettier.format(fileContent.designToken.paddings, {
    ...prettierConfig,
    filepath: filePath.designToken.paddings,
  }),
)

fs.writeFileSync(
  filePath.properties.applyProperty,
  prettier.format(fileContent.properties.applyProperty, {
    ...prettierConfig,
    filepath: filePath.properties.applyProperty,
  }),
)

fs.writeFileSync(
  filePath.properties.margins,
  prettier.format(fileContent.properties.margins, {
    ...prettierConfig,
    filepath: filePath.properties.margins,
  }),
)

fs.writeFileSync(
  filePath.properties.paddings,
  prettier.format(fileContent.properties.paddings, {
    ...prettierConfig,
    filepath: filePath.properties.paddings,
  }),
)

fs.writeFileSync(
  filePath.viewports,
  prettier.format(fileContent.viewports, {
    ...prettierConfig,
    filepath: filePath.viewports,
  }),
)

fs.writeFileSync(
  filePath.viewportsExport,
  prettier.format(fileContent.viewportsExport, {
    ...prettierConfig,
    filepath: filePath.viewportsExport,
  }),
)

fs.writeFileSync(
  filePath.sizesExport,
  prettier.format(fileContent.sizesExport, {
    ...prettierConfig,
    filepath: filePath.sizesExport,
  }),
)
