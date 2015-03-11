#! /bin/sh

CMD = "node cluster.js"
NAME = Badminton
PIDFILE = "badminton.pid"

case "$1" in
  start)
        echo "Starting $NAME: "
        nohup $CMD >> info.log 2>&1 &
        echo $! > $PIDFILE
        echo "$NAME."
        ;;
  status)
        ps aux | grep node
        ;;
  stop)
        echo "Stopping $NAME: "
        pid = `cat $PIDFILE`
        kill $pid
        rm $PIDFILE
        echo "$NAME."
        ;;
  restart)
        echo "Stopping $NAME: "
        pid = `cat $PIDFILE`
        kill $pid
        rm $PIDFILE
        echo "$NAME."
        rm info.log
        echo "Starting $NAME: "
        nohup $CMD >> info.log 2>&1 &
        echo $! > $PIDFILE
        echo "$NAME."
        ;;
  *)
        echo "Usage: ( start | status | stop | restart)"
        ;;
esac

exit 0

