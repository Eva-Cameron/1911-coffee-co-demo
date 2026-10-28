import sys
H=sys.argv[1]
bench=open(H+'/bench.html').read().replace('\r\n','\n')
kernel=open(H+'/kernel.js').read().replace('\r\n','\n').rstrip()
for name in sys.argv[2:]:
    fig=open(name+'.js').read().strip()
    open(f'hairline-{name}.html','w').write(bench.replace('/*KERNEL*/','\n'+kernel+'\n',1).replace('/*FIGURE*/','\n'+fig+'\n',1))
